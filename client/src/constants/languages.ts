export const LANGUAGES = {
  javascript: {
    baseCode: 'console.log("Welcome to Enigma compiler")',
    extension: "js",
    reset: "",
  },
  python: {
    baseCode: 'print("Welcome to Enigma compiler")',
    extension: "py",
    reset: "",
  },
  java: {
    baseCode: `class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Enigma compiler");
    }
}`,
    extension: "java",
    reset: `class Main {
    public static void main(String[] args) {
        
    }
}`,
  },
  cpp: {
    baseCode: `#include <iostream>

int main() {
    // Write C++ code here
    std::cout << "Welcome to Enigma compiler";

    return 0;
}`,
    extension: "cpp",
    reset: `#include <iostream>

int main() {
    // Write C++ code here

    return 0;
}`
  },
};
