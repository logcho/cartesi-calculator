#include <stdio.h>
#include <iostream>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

void createReport(httplib::Client &cli, const std::string &payload) {
    std::string report = std::string("{\"payload\":\"") + payload + std::string("\"}");
    auto r = cli.Post("/report", report, "application/json");    
    // Expect status 202
    std::cout << "Received report status " << r.value().status << std::endl;
}

void createNotice(httplib::Client &cli, const std::string &payload) {
    std::string notice = std::string("{\"payload\":\"") + payload + std::string("\"}");
    auto r = cli.Post("/notice", notice, "application/json");    
    // Expect status 201
    std::cout << "Received notice status " << r.value().status << std::endl;
}

std::string stringToHex(const std::string& input){
    std::ostringstream hexStream;
    hexStream << "0x";
    for(unsigned char c : input){
        hexStream << std::hex <<  std::setw(2) << std::setfill('0') << (int)c;
    }
    return hexStream.str();
}

std::string hexToString(const std::string& hexInput){
    if(hexInput.substr(0, 2) != "0x"){
        throw std::invalid_argument("Invalid hex input: Missing 0x prefix");
    }
    std::string result;
    for(size_t i = 2; i < hexInput.size(); i += 2){
        std::string byteString = hexInput.substr(i, 2);
        char byte = static_cast<char>(std::stoul(byteString, nullptr, 16));
        result.push_back(byte);
    }
    return result;
}

bool isOperator(char ch) {
    return ch == '+' || ch == '-' || ch == '*' || ch == '/';
}

bool isValidExpression(const std::string& expression) {
    if (expression.empty()) return false; // Empty string is invalid

    bool lastWasOperator = true; // Ensure no leading operator
    bool hasNumber = false;       // Track if we have at least one number

    for (size_t i = 0; i < expression.size(); i++) {
        char ch = expression[i];

        if (std::isspace(ch)) continue; // Ignore spaces

        if (std::isdigit(ch)) {
            hasNumber = true;
            lastWasOperator = false; // Reset flag since we saw a number
        } else if (isOperator(ch)) {
            if (lastWasOperator) return false; // Two operators in a row or leading operator
            lastWasOperator = true;
        } else {
            return false; // Invalid character
        }
    }

    return hasNumber && !lastWasOperator; // Must end with a number
}

int precedence(char op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    return 0;
}

int applyOperation(int a, int b, char op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': 
            if (b == 0) throw std::runtime_error("Division by zero");
            return a / b;
        default: throw std::invalid_argument("Unsupported operator");
    }
}

std::string evaluateExpression(const std::string& expression) {
    if (!isValidExpression(expression)) {
        return "Error: Invalid mathematical expression";
    }

    std::stack<int> values;
    std::stack<char> ops;
    std::istringstream tokens(expression);
    
    int num;
    char ch;
    
    try {
        while (tokens >> std::ws) { // Ignore whitespace
            if (std::isdigit(tokens.peek())) {  
                tokens >> num;  // Parse the number as an integer
                values.push(num);
            } else { 
                tokens >> ch;
                while (!ops.empty() && precedence(ops.top()) >= precedence(ch)) {
                    int b = values.top(); values.pop();
                    int a = values.top(); values.pop();
                    char op = ops.top(); ops.pop();
                    values.push(applyOperation(a, b, op));
                }
                ops.push(ch);
            }
        }

        while (!ops.empty()) {
            int b = values.top(); values.pop();
            int a = values.top(); values.pop();
            char op = ops.top(); ops.pop();
            values.push(applyOperation(a, b, op));
        }

        return std::to_string(values.top()); // Return result as a string
    } catch (const std::exception& e) {
        return std::string("Error: ") + e.what(); // Return error as a string
    }
}



std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Data: " << data << std::endl;
    std::cout << "Address: " << data.get("metadata").get("msg_sender").to_str() << std::endl;
    std::cout << "Payload: " << data.get("payload").to_str() << std::endl;
    std::string decodedPayload = hexToString(data.get("payload").to_str());
    std::cout << "Decoded Payload: " << decodedPayload << std::endl;
    std::string evaluatedExpression = evaluateExpression(decodedPayload);
    std::cout << "Handle expression: " << evaluatedExpression << std::endl;
    createNotice(cli, stringToHex(evaluatedExpression));
    return "accept";
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received inspect request data " << data << std::endl;
    return "accept";
}

int main(int argc, char **argv)
{
    std::map<std::string, decltype(&handle_advance)> handlers = {
        {std::string("advance_state"), &handle_advance},
        {std::string("inspect_state"), &handle_inspect},
    };
    httplib::Client cli(getenv("ROLLUP_HTTP_SERVER_URL"));
    cli.set_read_timeout(20, 0);
    std::string status("accept");
    std::string rollup_address;
    while (true)
    {
        std::cout << "Sending finish" << std::endl;
        auto finish = std::string("{\"status\":\"") + status + std::string("\"}");
        auto r = cli.Post("/finish", finish, "application/json");
        std::cout << "Received finish status " << r.value().status << std::endl;
        if (r.value().status == 202)
        {
            std::cout << "No pending rollup request, trying again" << std::endl;
        }
        else
        {
            picojson::value rollup_request;
            picojson::parse(rollup_request, r.value().body);
            picojson::value metadata = rollup_request.get("data").get("metadata");
            auto request_type = rollup_request.get("request_type").get<std::string>();
            auto handler = handlers.find(request_type)->second;
            auto data = rollup_request.get("data");
            status = (*handler)(cli, data);
        }
    }
    return 0;
}
