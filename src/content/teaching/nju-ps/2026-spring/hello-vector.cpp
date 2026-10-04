#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    if (!(std::cin >> n) || n < 0 || n > 1000) {
        std::cerr << "请输入 0 到 1000 之间的整数 n\n";
        return 1;
    }

    std::vector<int> values(n);
    for (int& value : values) {
        if (!(std::cin >> value)) {
            std::cerr << "输入的整数不够\n";
            return 1;
        }
    }

    std::sort(values.begin(), values.end());
    for (int value : values) std::cout << value << ' ';
    std::cout << '\n';
}
