# Компендиум по C++: от полного новичка до уверенного уровня

Подробный учебный маршрут по C++ для студентов, которые могут начинать с нуля. Материал идет от установки Visual Studio и первого `Hello, World!` до ООП, шаблонов, STL, работы с памятью, тестирования, CMake, многопоточности и базовой оптимизации. В каждом крупном разделе есть примеры и задания для самостоятельной работы.

---

## 0. Как работать с этим компендиумом

### Цель курса
После прохождения материала студент должен уметь:
- создавать и запускать C++ проекты в Visual Studio;
- читать ошибки компилятора и пользоваться отладчиком;
- уверенно писать консольные программы;
- работать с типами, функциями, коллекциями, файлами;
- понимать указатели, ссылки, память и RAII;
- проектировать простые классы и использовать ООП без лишней магии;
- применять контейнеры и алгоритмы стандартной библиотеки;
- подключать сторонние библиотеки и собирать проекты через CMake;
- писать тесты и выполнять базовую диагностику ошибок;
- понимать, какие темы относятся к intermediate/advanced уровню.

### Рекомендуемый режим обучения
1. Прочитать раздел.
2. Повторить примеры вручную, не копируя весь код сразу.
3. Изменить пример: добавить проверку, новый случай, другой вывод.
4. Выполнить задания.
5. Сохранить код в отдельной папке или Git-репозитории.

### Минимальный набор инструментов
- Windows 10/11.
- Visual Studio Community с workload **Desktop development with C++**.
- Git.
- Желательно: CMake, vcpkg, Windows Terminal.

---

## 1. Что такое C++

C++ - компилируемый язык общего назначения. Он используется там, где важны производительность, контроль ресурсов и доступ к низкоуровневым механизмам: игры, движки, desktop-приложения, финансовые системы, системное ПО, embedded, драйверы, браузеры, базы данных, высоконагруженные сервисы.

### Особенности C++
- **Статическая типизация**: типы переменных известны на этапе компиляции.
- **Компиляция в машинный код**: перед запуском исходный код превращается в исполняемый файл.
- **Мультипарадигменность**: процедурный стиль, ООП, generic programming, функциональные элементы.
- **Ручной и автоматизированный контроль ресурсов**: можно работать с памятью напрямую, но современный C++ предпочитает RAII и умные указатели.
- **Большая стандартная библиотека**: строки, контейнеры, алгоритмы, потоки, файлы, даты, многопоточность.
- **Высокая сложность**: язык мощный, но требует дисциплины.

### Чем C++ отличается от Python, JavaScript и C#
- В C++ нужно думать о времени жизни объектов.
- Ошибки часто находятся компилятором, но часть ошибок проявляется во время выполнения.
- Производительность ближе к железу, но цена - больше ответственности.
- Стандартная библиотека мощная, но не закрывает все прикладные задачи: GUI, HTTP, JSON и БД часто требуют сторонних библиотек.

### Первый принцип
В современном C++ не нужно начинать с `new`, `delete`, сырых массивов и ручного управления памятью. Сначала используйте:
- `std::string` вместо C-строк;
- `std::vector` вместо динамических массивов;
- `std::unique_ptr` и `std::shared_ptr` вместо ручного `delete`;
- алгоритмы STL вместо самописных циклов там, где это делает код яснее.

### Самостоятельная работа
1. Найдите 5 областей, где используется C++.
2. Объясните своими словами разницу между компиляцией и интерпретацией.
3. Напишите короткий список причин, почему C++ сложнее Python, но остается востребованным.

---

## 2. Установка и настройка Visual Studio для C++

### 2.1 Установка
1. Скачайте Visual Studio Community с сайта Microsoft.
2. Запустите Visual Studio Installer.
3. Выберите workload **Desktop development with C++**.
4. Убедитесь, что установлены:
   - MSVC compiler toolset;
   - Windows SDK;
   - C++ CMake tools for Windows;
   - C++ AddressSanitizer, если доступен в вашей версии;
   - Git for Windows, если предлагается установщиком.
5. Нажмите **Install**.

### 2.2 Проверка установки
Откройте **Developer PowerShell for VS** или **Developer Command Prompt for VS** и выполните:

```powershell
cl
```

Если компилятор установлен, вы увидите информацию о Microsoft C/C++ Optimizing Compiler. Ошибка вида `cl is not recognized` обычно означает, что вы открыли обычный PowerShell, а не developer shell, или не установили workload для C++.

### 2.3 Создание первого проекта в Visual Studio
1. Откройте Visual Studio.
2. Нажмите **Create a new project**.
3. В поиске введите `Console App`.
4. Выберите шаблон **Console App** для C++.
5. Назовите проект `HelloCpp`.
6. Выберите папку, например `C:\Users\<имя>\source\repos`.
7. Нажмите **Create**.

В проекте появится файл `.cpp`, обычно с функцией `main`.

### 2.4 Запуск программы
- **Ctrl+F5** - запуск без отладки. Окно консоли останется открытым.
- **F5** - запуск с отладчиком.
- **Ctrl+Shift+B** - собрать решение.
- **Build > Clean Solution** - очистить результаты сборки.
- **Build > Rebuild Solution** - полностью пересобрать.

Пример:

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, C++!\n";
    return 0;
}
```

### 2.5 Debug и Release
В верхней панели Visual Studio есть конфигурации:
- **Debug** - медленнее, но удобно отлаживать. Есть символы отладки, отключены многие оптимизации.
- **Release** - быстрее, используется для готовой программы. Оптимизации включены, отлаживать сложнее.

Также выбирайте платформу:
- **x64** - почти всегда правильный выбор для современных Windows-приложений.
- **x86** - только если нужен 32-битный бинарник.

### 2.6 Включение современного стандарта C++
1. Нажмите правой кнопкой по проекту.
2. Откройте **Properties**.
3. Перейдите в **Configuration Properties > C/C++ > Language**.
4. В поле **C++ Language Standard** выберите `ISO C++20` или новее, если курс/компилятор это поддерживает.
5. Нажмите **Apply**.

Для учебного курса удобно использовать C++20: он современный, но уже достаточно стабильно поддерживается.

### 2.7 Полезные настройки проекта
В **Project Properties**:
- **C/C++ > Warning Level**: поставьте `/W4`.
- **C/C++ > Treat Warnings As Errors**: для учебных проектов можно включить после первых тем.
- **C/C++ > Language > Conformance mode**: включить `/permissive-`.
- **C/C++ > Code Generation > Runtime Library**: обычно оставьте значение по умолчанию.
- **Debugging > Command Arguments**: аргументы командной строки для программы.

### 2.8 Как пользоваться Solution Explorer
- **Solution** - контейнер для одного или нескольких проектов.
- **Project** - конкретное приложение или библиотека.
- **Source Files** - `.cpp` файлы с реализацией.
- **Header Files** - `.h` или `.hpp` файлы с объявлениями.
- **Resource Files** - ресурсы Windows-приложений.

Чтобы добавить файл:
1. Правой кнопкой по проекту.
2. **Add > New Item**.
3. Выберите `C++ File (.cpp)` или `Header File (.h)`.

### 2.9 Отладчик Visual Studio
Главные инструменты:
- **Breakpoint** (`F9`) - остановить программу на строке.
- **Step Over** (`F10`) - выполнить строку, не заходя внутрь функции.
- **Step Into** (`F11`) - зайти внутрь функции.
- **Step Out** (`Shift+F11`) - выйти из текущей функции.
- **Continue** (`F5`) - продолжить выполнение.
- **Locals** - локальные переменные.
- **Watch** - выражения, за которыми хотите наблюдать.
- **Call Stack** - цепочка вызовов функций.
- **Immediate Window** - быстрые проверки выражений во время отладки.

Пример для отладки:

```cpp
#include <iostream>

int square(int x)
{
    int result = x * x;
    return result;
}

int main()
{
    int value = 7;
    int answer = square(value);
    std::cout << answer << '\n';
}
```

Поставьте breakpoint на строку `int answer = square(value);`, нажмите `F5`, затем используйте `F11`.

### 2.10 Частые проблемы в Visual Studio
- **Не найден `iostream`**: не установлен C++ workload или повреждена установка.
- **Файл не компилируется**: он не добавлен в проект, либо открыт вне проекта.
- **Консоль сразу закрывается**: запускайте через `Ctrl+F5`.
- **Ошибки линковки LNK2019**: объявили функцию, но не написали реализацию или `.cpp` файл не добавлен в проект.
- **Работает в Debug, падает в Release**: возможно, есть неопределенное поведение, неинициализированная переменная, выход за границы массива.

### Самостоятельная работа
1. Создайте проект `FirstSteps`.
2. Напишите программу, которая выводит ваше имя, возраст и город.
3. Запустите ее через `Ctrl+F5`.
4. Поставьте breakpoint и выполните программу пошагово.
5. Измените стандарт C++ на C++20 и включите `/W4`.

---

## 3. Минимальная структура программы

```cpp
#include <iostream>

int main()
{
    std::cout << "Program started\n";
    return 0;
}
```

### Разбор
- `#include <iostream>` подключает стандартную библиотеку ввода-вывода.
- `int main()` - точка входа программы.
- `{ ... }` - тело функции.
- `std::cout` - поток вывода в консоль.
- `<<` - оператор вывода в поток.
- `'\n'` - перевод строки.
- `return 0;` - программа завершилась успешно.

В современных компиляторах `return 0;` в `main` можно не писать, но новичку лучше писать явно.

### Комментарии

```cpp
// Однострочный комментарий

/*
   Многострочный комментарий.
   Удобен для временных пояснений.
*/
```

Комментарии должны объяснять не очевидный синтаксис, а причину решения.

### Простое форматирование кода
Плохо:

```cpp
int main(){int x=10;if(x>0){std::cout<<"ok";}}
```

Лучше:

```cpp
int main()
{
    int x = 10;

    if (x > 0)
    {
        std::cout << "ok\n";
    }
}
```

### Задания
1. Напишите программу, которая выводит три строки: название курса, ваше имя, текущую дату.
2. Добавьте комментарии к каждой логической части программы.
3. Удалите `#include <iostream>` и посмотрите, какую ошибку выдаст компилятор.
4. Удалите точку с запятой после `std::cout << ...` и прочитайте ошибку.

---

## 4. Переменные, типы и константы

Переменная - именованная область памяти, в которой хранится значение.

```cpp
int age = 19;
double temperature = 36.6;
char grade = 'A';
bool isActive = true;
std::string name = "Anna";
```

Для `std::string` нужен заголовок:

```cpp
#include <string>
```

### Основные типы
- `int` - целое число.
- `long long` - большое целое число.
- `double` - вещественное число двойной точности.
- `float` - вещественное число одинарной точности.
- `char` - один символ.
- `bool` - `true` или `false`.
- `std::string` - строка.

### Инициализация
В C++ есть несколько форм инициализации:

```cpp
int a = 10;
int b(20);
int c{30};
```

Для обучения предпочтительна фигурная инициализация:

```cpp
int count{5};
double price{19.99};
```

Она помогает избежать некоторых неявных сужающих преобразований.

### Константы

```cpp
const int daysInWeek = 7;
constexpr double pi = 3.1415926535;
```

- `const` - значение нельзя изменить после инициализации.
- `constexpr` - значение известно на этапе компиляции, если это возможно.

### `auto`
`auto` просит компилятор вывести тип:

```cpp
auto value = 42;        // int
auto name = "Alex";     // const char*
auto text = std::string{"Alex"}; // std::string
```

Новичку не стоит злоупотреблять `auto`. Используйте его, когда тип очевиден или очень длинный.

### Размеры типов

```cpp
#include <iostream>

int main()
{
    std::cout << sizeof(int) << '\n';
    std::cout << sizeof(double) << '\n';
}
```

`sizeof` возвращает размер типа или объекта в байтах.

### Переполнение

```cpp
#include <iostream>

int main()
{
    int x = 2'000'000'000;
    int y = x + x;
    std::cout << y << '\n';
}
```

Для знаковых целых переполнение - неопределенное поведение. Не рассчитывайте на "просто неправильное число".

### Задания
1. Создайте переменные для описания товара: название, цена, количество, есть ли скидка.
2. Посчитайте итоговую стоимость.
3. Выведите размеры типов `int`, `long long`, `float`, `double`, `bool`.
4. Попробуйте присвоить `int x{3.14};` и объясните ошибку.
5. Создайте `constexpr int minutesInHour = 60;` и используйте его в расчете.

---

## 5. Ввод, вывод и форматирование

### Вывод

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello\n";
    std::cout << "Age: " << 20 << '\n';
}
```

### Ввод

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string name;
    int age{};

    std::cout << "Name: ";
    std::cin >> name;

    std::cout << "Age: ";
    std::cin >> age;

    std::cout << "Hello, " << name << ". Age: " << age << '\n';
}
```

`std::cin >> name` читает только до пробела. Для строки с пробелами используйте `std::getline`.

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string fullName;

    std::cout << "Full name: ";
    std::getline(std::cin, fullName);

    std::cout << "Hello, " << fullName << '\n';
}
```

### Проблема `cin` + `getline`

```cpp
#include <iostream>
#include <limits>
#include <string>

int main()
{
    int age{};
    std::string comment;

    std::cin >> age;
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

    std::getline(std::cin, comment);
}
```

После `std::cin >> age` в буфере остается перевод строки. `ignore` очищает остаток строки.

### Форматирование чисел

```cpp
#include <iomanip>
#include <iostream>

int main()
{
    double price = 123.456789;

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Price: " << price << '\n';
}
```

### Проверка ввода

```cpp
#include <iostream>

int main()
{
    int value{};
    std::cout << "Enter integer: ";

    if (std::cin >> value)
    {
        std::cout << "You entered " << value << '\n';
    }
    else
    {
        std::cout << "Invalid input\n";
    }
}
```

### Задания
1. Запросите имя, возраст и средний балл студента. Выведите анкету.
2. Запросите радиус круга и выведите площадь с точностью 3 знака.
3. Запросите строку с пробелами через `getline`.
4. Напишите программу-конвертер рублей в доллары по заданному курсу.
5. Добавьте проверку, что вводимое число действительно число.

---

## 6. Операторы и выражения

### Арифметика

```cpp
int a = 10;
int b = 3;

int sum = a + b;
int diff = a - b;
int product = a * b;
int quotient = a / b;  // 3
int remainder = a % b; // 1
```

Если оба операнда целые, деление будет целочисленным.

```cpp
double x = 10.0 / 3.0;
```

### Сравнения

```cpp
bool ok = age >= 18;
bool same = password == confirm;
bool different = x != y;
```

### Логические операторы

```cpp
bool canEnter = age >= 18 && hasTicket;
bool needHelp = isLost || isNewUser;
bool blocked = !isActive;
```

### Составные присваивания

```cpp
score += 10;
count -= 1;
price *= 1.2;
```

### Инкремент и декремент

```cpp
++i;
--i;
```

В простых циклах чаще используйте префиксную форму `++i`.

### Приоритет операторов
Скобки дешевле ошибок:

```cpp
double average = static_cast<double>(a + b + c) / 3;
```

### Явные преобразования

```cpp
int total = 10;
int count = 4;

double average = static_cast<double>(total) / count;
```

`static_cast` лучше, чем C-style cast, потому что явно показывает намерение и проверяется компилятором строже.

### Задания
1. Напишите калькулятор для двух чисел: `+`, `-`, `*`, `/`, `%`.
2. Проверьте, является ли число четным.
3. Проверьте, входит ли возраст в диапазон от 14 до 18 включительно.
4. Посчитайте среднее арифметическое трех оценок.
5. Объясните разницу между `10 / 4` и `10.0 / 4`.

---

## 7. Условия

### `if`, `else if`, `else`

```cpp
#include <iostream>

int main()
{
    int score{};
    std::cin >> score;

    if (score >= 90)
    {
        std::cout << "Excellent\n";
    }
    else if (score >= 70)
    {
        std::cout << "Good\n";
    }
    else if (score >= 50)
    {
        std::cout << "Pass\n";
    }
    else
    {
        std::cout << "Fail\n";
    }
}
```

### Тернарный оператор

```cpp
std::string result = age >= 18 ? "adult" : "minor";
```

Используйте тернарный оператор только для простых выражений.

### `switch`

```cpp
#include <iostream>

int main()
{
    int command{};
    std::cin >> command;

    switch (command)
    {
    case 1:
        std::cout << "New game\n";
        break;
    case 2:
        std::cout << "Load game\n";
        break;
    case 0:
        std::cout << "Exit\n";
        break;
    default:
        std::cout << "Unknown command\n";
        break;
    }
}
```

`break` нужен, чтобы не провалиться в следующий `case`.

### Задания
1. Напишите программу, которая определяет знак числа.
2. По номеру месяца выведите сезон.
3. По оценке от 1 до 5 выведите текстовое описание.
4. Напишите проверку логина и пароля.
5. Создайте меню из 4 пунктов через `switch`.

---

## 8. Циклы

### `while`

```cpp
int i = 0;

while (i < 5)
{
    std::cout << i << '\n';
    ++i;
}
```

### `do while`

```cpp
int choice{};

do
{
    std::cout << "1. Play\n";
    std::cout << "0. Exit\n";
    std::cin >> choice;
}
while (choice != 0);
```

Тело `do while` выполняется минимум один раз.

### `for`

```cpp
for (int i = 0; i < 10; ++i)
{
    std::cout << i << ' ';
}
```

### `break` и `continue`

```cpp
for (int i = 1; i <= 10; ++i)
{
    if (i == 5)
    {
        continue;
    }

    if (i == 9)
    {
        break;
    }

    std::cout << i << '\n';
}
```

### Бесконечный цикл

```cpp
while (true)
{
    int command{};
    std::cin >> command;

    if (command == 0)
    {
        break;
    }
}
```

### Задания
1. Выведите числа от 1 до 100.
2. Найдите сумму чисел от 1 до `n`.
3. Выведите таблицу умножения.
4. Запрашивайте пароль, пока пользователь не введет правильный.
5. Найдите факториал числа.
6. Проверьте, является ли число простым.
7. Реализуйте игру "угадай число" с ограничением попыток.

---

## 9. Функции

Функция - именованный блок кода, который можно вызывать многократно.

```cpp
#include <iostream>

int add(int a, int b)
{
    return a + b;
}

int main()
{
    std::cout << add(2, 3) << '\n';
}
```

### `void`

```cpp
void printLine()
{
    std::cout << "----------------\n";
}
```

`void` означает, что функция не возвращает значение.

### Объявление и определение

```cpp
int multiply(int a, int b); // объявление

int main()
{
    std::cout << multiply(4, 5) << '\n';
}

int multiply(int a, int b) // определение
{
    return a * b;
}
```

### Передача параметров

По значению:

```cpp
void increment(int x)
{
    ++x;
}
```

Исходная переменная не изменится.

По ссылке:

```cpp
void increment(int& x)
{
    ++x;
}
```

Исходная переменная изменится.

По константной ссылке:

```cpp
void printName(const std::string& name)
{
    std::cout << name << '\n';
}
```

Так удобно передавать большие объекты без копирования и без права изменения.

### Возврат нескольких значений

```cpp
#include <tuple>

std::tuple<int, int> divmod(int a, int b)
{
    return {a / b, a % b};
}
```

Или через структуру:

```cpp
struct DivisionResult
{
    int quotient{};
    int remainder{};
};

DivisionResult divide(int a, int b)
{
    return {a / b, a % b};
}
```

Структура обычно читабельнее.

### Перегрузка функций

```cpp
int maxValue(int a, int b)
{
    return a > b ? a : b;
}

double maxValue(double a, double b)
{
    return a > b ? a : b;
}
```

### Значения по умолчанию

```cpp
void greet(const std::string& name = "student")
{
    std::cout << "Hello, " << name << '\n';
}
```

### Задания
1. Напишите функцию `int square(int x)`.
2. Напишите функцию `bool isEven(int x)`.
3. Напишите функцию `double circleArea(double radius)`.
4. Напишите функцию `int maxOfThree(int a, int b, int c)`.
5. Передайте число по ссылке и увеличьте его на 10.
6. Напишите функцию, которая возвращает структуру с минимумом, максимумом и средним значением трех чисел.

---

## 10. Область видимости, время жизни и пространства имен

### Локальные переменные

```cpp
int main()
{
    int x = 10;

    if (x > 0)
    {
        int y = 20;
        std::cout << y << '\n';
    }

    // y здесь недоступна
}
```

### Глобальные переменные

```cpp
int globalCounter = 0;
```

Глобальные переменные усложняют тестирование и поддержку. Для учебных задач иногда допустимы, но в реальном коде их лучше избегать.

### `static` локальная переменная

```cpp
int nextId()
{
    static int id = 0;
    ++id;
    return id;
}
```

Такая переменная создается один раз и сохраняет значение между вызовами.

### Пространства имен

```cpp
namespace math
{
    int square(int x)
    {
        return x * x;
    }
}

int main()
{
    std::cout << math::square(5) << '\n';
}
```

Не пишите `using namespace std;` в заголовочных файлах. В учебных `.cpp` файлах это встречается, но лучше привыкать к `std::`.

### Задания
1. Создайте пространство имен `geometry` с функциями площади круга и прямоугольника.
2. Проверьте, что переменная внутри `if` недоступна снаружи.
3. Напишите функцию `nextId()` со `static` счетчиком.
4. Объясните, чем локальная переменная отличается от глобальной.

---

## 11. Массивы, `std::array` и `std::vector`

### C-массивы

```cpp
int numbers[5]{1, 2, 3, 4, 5};
```

Минусы:
- размер фиксирован;
- легко выйти за границы;
- неудобно передавать в функции;
- нет методов `size`, `push_back`.

### `std::array`

```cpp
#include <array>
#include <iostream>

int main()
{
    std::array<int, 5> numbers{1, 2, 3, 4, 5};

    for (int value : numbers)
    {
        std::cout << value << '\n';
    }
}
```

`std::array` - безопасная обертка над массивом фиксированного размера.

### `std::vector`

```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector<int> numbers;

    numbers.push_back(10);
    numbers.push_back(20);
    numbers.push_back(30);

    for (int value : numbers)
    {
        std::cout << value << '\n';
    }
}
```

`std::vector` - динамический массив. Это основной контейнер для последовательности элементов.

### Индексация

```cpp
std::vector<int> values{10, 20, 30};

std::cout << values[0] << '\n';
std::cout << values.at(1) << '\n';
```

- `operator[]` быстрее, но не проверяет границы.
- `.at()` проверяет границы и бросает исключение при ошибке.

### Передача vector в функцию

```cpp
int sum(const std::vector<int>& values)
{
    int result = 0;

    for (int value : values)
    {
        result += value;
    }

    return result;
}
```

Передавайте по `const&`, если функция не должна менять контейнер.

### Задания
1. Считайте `n` чисел в `std::vector<int>` и выведите их сумму.
2. Найдите минимальный и максимальный элемент.
3. Посчитайте количество четных чисел.
4. Разверните вектор вручную без `std::reverse`.
5. Удалите все отрицательные числа.
6. Реализуйте меню: добавить число, удалить последнее, вывести все, найти среднее.

---

## 12. Строки и символы

### `std::string`

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string text = "C++ is powerful";

    std::cout << text.size() << '\n';
    std::cout << text[0] << '\n';
    std::cout << text.substr(0, 3) << '\n';
}
```

### Склеивание строк

```cpp
std::string first = "Hello";
std::string second = "World";
std::string message = first + ", " + second + "!";
```

### Поиск

```cpp
std::string email = "student@example.com";

if (email.find('@') != std::string::npos)
{
    std::cout << "Looks like email\n";
}
```

### Посимвольная обработка

```cpp
#include <cctype>
#include <iostream>
#include <string>

int main()
{
    std::string text = "Hello123";
    int digits = 0;

    for (unsigned char ch : text)
    {
        if (std::isdigit(ch))
        {
            ++digits;
        }
    }

    std::cout << digits << '\n';
}
```

Для функций из `<cctype>` безопаснее приводить символ к `unsigned char`.

### Важное про Unicode
`std::string` хранит байты. Если строка в UTF-8 содержит русские буквы, `size()` вернет количество байт, а не количество видимых символов. Для большинства учебных консольных задач это не критично, но для реальных приложений нужно понимать кодировки.

### Задания
1. Посчитайте количество букв, цифр и пробелов в строке.
2. Проверьте, является ли строка палиндромом.
3. Замените все пробелы на `_`.
4. Считайте ФИО одной строкой и выведите инициалы.
5. Проверьте простую валидность email: есть `@`, есть точка после `@`.
6. Напишите функцию `toLowerAscii`.

---

## 13. Указатели и ссылки

### Ссылка

```cpp
int x = 10;
int& ref = x;

ref = 20;
std::cout << x << '\n'; // 20
```

Ссылка - другое имя существующего объекта. Она должна быть сразу инициализирована и не может быть "перепривязана".

### Указатель

```cpp
int x = 10;
int* ptr = &x;

std::cout << ptr << '\n';  // адрес
std::cout << *ptr << '\n'; // значение по адресу
```

- `&x` - взять адрес.
- `int*` - указатель на `int`.
- `*ptr` - разыменование, доступ к объекту.

### `nullptr`

```cpp
int* ptr = nullptr;

if (ptr != nullptr)
{
    std::cout << *ptr << '\n';
}
```

Не разыменовывайте `nullptr`.

### Когда использовать ссылку, а когда указатель
Используйте ссылку:
- параметр обязателен;
- объект точно существует;
- не нужно менять, на что указывает параметр.

Используйте указатель:
- значение может отсутствовать (`nullptr`);
- нужно работать с массивом/буфером низкого уровня;
- API требует указатель.

### Частая ошибка

```cpp
int* bad()
{
    int x = 10;
    return &x; // ошибка: возвращаем адрес локальной переменной
}
```

После выхода из функции `x` уничтожается. Указатель становится висячим.

### Задания
1. Напишите функцию `swapValues(int& a, int& b)`.
2. Напишите функцию, которая принимает `int*` и печатает значение, если указатель не `nullptr`.
3. Создайте переменную, указатель на нее и ссылку на нее. Измените значение через ссылку и через указатель.
4. Объясните, почему нельзя возвращать указатель на локальную переменную.

---

## 14. Память, RAII и умные указатели

### Стек и куча
Упрощенно:
- **стек** - быстрые локальные переменные, автоматическое уничтожение при выходе из области видимости;
- **куча** - динамическая память, живет до явного освобождения или до уничтожения управляющего объекта.

### Плохой старый стиль

```cpp
int* p = new int{42};
std::cout << *p << '\n';
delete p;
```

Такой код легко сломать: забыть `delete`, вызвать `delete` дважды, выйти из функции раньше из-за исключения.

### RAII
RAII - Resource Acquisition Is Initialization. Ресурс захватывается в конструкторе объекта и освобождается в деструкторе.

Примеры RAII:
- `std::vector` управляет динамической памятью;
- `std::string` управляет памятью строки;
- `std::fstream` закрывает файл;
- `std::unique_ptr` удаляет объект;
- `std::lock_guard` освобождает mutex.

### `std::unique_ptr`

```cpp
#include <iostream>
#include <memory>

struct User
{
    std::string name;
};

int main()
{
    auto user = std::make_unique<User>();
    user->name = "Anna";

    std::cout << user->name << '\n';
}
```

`unique_ptr` владеет объектом единолично. Копировать нельзя, но можно перемещать.

### `std::shared_ptr`

```cpp
#include <memory>

auto a = std::make_shared<int>(10);
auto b = a;
```

`shared_ptr` использует счетчик ссылок. Объект удаляется, когда последний `shared_ptr` уничтожен. Не используйте `shared_ptr` "на всякий случай": владение должно быть осознанным.

### `std::weak_ptr`
`weak_ptr` наблюдает за объектом, которым владеет `shared_ptr`, но не увеличивает счетчик владения. Нужен для разрыва циклических ссылок.

### Правило
В прикладном современном C++ почти никогда не пишите `new` и `delete` напрямую. Используйте стандартные контейнеры и умные указатели.

### Задания
1. Создайте `std::unique_ptr<int>` через `std::make_unique`.
2. Создайте структуру `Book` и храните ее в `unique_ptr`.
3. Попробуйте скопировать `unique_ptr` и объясните ошибку.
4. Передайте `unique_ptr` в функцию через `std::move`.
5. Объясните, чем `unique_ptr` отличается от `shared_ptr`.

---

## 15. Структуры и классы

### `struct`

```cpp
struct Student
{
    std::string name;
    int age{};
    double averageGrade{};
};
```

Использование:

```cpp
Student s{"Anna", 19, 4.7};
std::cout << s.name << '\n';
```

### Методы

```cpp
struct Student
{
    std::string name;
    int age{};
    double averageGrade{};

    bool isExcellent() const
    {
        return averageGrade >= 4.5;
    }
};
```

`const` после метода означает, что метод не изменяет объект.

### `class`

```cpp
class BankAccount
{
public:
    explicit BankAccount(std::string owner, double initialBalance)
        : owner_{std::move(owner)}, balance_{initialBalance}
    {
    }

    void deposit(double amount)
    {
        if (amount > 0)
        {
            balance_ += amount;
        }
    }

    bool withdraw(double amount)
    {
        if (amount <= 0 || amount > balance_)
        {
            return false;
        }

        balance_ -= amount;
        return true;
    }

    double balance() const
    {
        return balance_;
    }

private:
    std::string owner_;
    double balance_{};
};
```

### `struct` vs `class`
Главное различие по умолчанию:
- у `struct` члены public;
- у `class` члены private.

По стилю:
- `struct` часто используют для простых данных;
- `class` - для объектов с инвариантами и поведением.

### Инкапсуляция
Инкапсуляция - сокрытие внутреннего состояния и предоставление безопасного публичного интерфейса.

Плохо:

```cpp
struct Account
{
    double balance;
};
```

Любой код может сделать `balance = -1000000`.

Лучше:

```cpp
class Account
{
public:
    bool withdraw(double amount);
    void deposit(double amount);
    double balance() const;

private:
    double balance_{};
};
```

### Задания
1. Создайте `struct Point` с координатами `x`, `y`.
2. Напишите функцию расстояния между двумя точками.
3. Создайте `class Rectangle` с шириной и высотой, методами `area` и `perimeter`.
4. Запретите создание прямоугольника с отрицательными сторонами.
5. Создайте `class TodoItem`: текст, статус выполнения, методы `markDone`, `isDone`.

---

## 16. Конструкторы, деструкторы и правило нуля

### Конструктор

```cpp
class User
{
public:
    User(std::string name, int age)
        : name_{std::move(name)}, age_{age}
    {
    }

private:
    std::string name_;
    int age_{};
};
```

Список инициализации после `:` предпочтительнее присваиваний в теле конструктора.

### `explicit`

```cpp
class Meter
{
public:
    explicit Meter(double value)
        : value_{value}
    {
    }

private:
    double value_{};
};
```

`explicit` запрещает неожиданные неявные преобразования.

### Деструктор

```cpp
class Logger
{
public:
    ~Logger()
    {
        std::cout << "Logger destroyed\n";
    }
};
```

Деструктор вызывается автоматически при уничтожении объекта.

### Правило нуля
Если класс состоит из стандартных типов, `std::string`, `std::vector`, умных указателей и других RAII-объектов, часто не нужно писать:
- деструктор;
- copy constructor;
- copy assignment;
- move constructor;
- move assignment.

Пусть компилятор сгенерирует их сам.

### Правило пяти
Если класс вручную владеет ресурсом, нужно продумать пять специальных функций:
- destructor;
- copy constructor;
- copy assignment operator;
- move constructor;
- move assignment operator.

Но для учебного и прикладного кода лучше проектировать классы так, чтобы работало правило нуля.

### Задания
1. Создайте класс `Timer`, который в конструкторе печатает `start`, а в деструкторе `stop`.
2. Создайте класс `User` с `explicit` конструктором.
3. Объясните, почему `std::vector` не требует ручного деструктора.
4. Создайте класс `Library`, который содержит `std::vector<Book>`.

---

## 17. Перегрузка операторов

Операторы можно перегружать для пользовательских типов, если это делает код естественным.

### Пример: `Point`

```cpp
struct Point
{
    int x{};
    int y{};
};

Point operator+(const Point& a, const Point& b)
{
    return {a.x + b.x, a.y + b.y};
}

bool operator==(const Point& a, const Point& b)
{
    return a.x == b.x && a.y == b.y;
}
```

### Вывод в поток

```cpp
#include <ostream>

std::ostream& operator<<(std::ostream& out, const Point& p)
{
    out << '(' << p.x << ", " << p.y << ')';
    return out;
}
```

### Когда не надо перегружать операторы
Не перегружайте оператор, если его смысл будет неожиданным. Например, `operator+` для сохранения файла выглядит странно. Лучше метод `save`.

### Задания
1. Для `Point` реализуйте `operator-`.
2. Для `Point` реализуйте `operator<<`.
3. Для класса `Money` реализуйте сложение и сравнение.
4. Объясните, почему перегрузка операторов может ухудшить читаемость.

---

## 18. Наследование и полиморфизм

### Базовый класс

```cpp
class Shape
{
public:
    virtual ~Shape() = default;

    virtual double area() const = 0;
};
```

`= 0` делает метод чисто виртуальным, а класс абстрактным.

### Производные классы

```cpp
class Circle : public Shape
{
public:
    explicit Circle(double radius)
        : radius_{radius}
    {
    }

    double area() const override
    {
        return 3.1415926535 * radius_ * radius_;
    }

private:
    double radius_{};
};
```

`override` просит компилятор проверить, что метод действительно переопределяет виртуальный метод базового класса.

### Полиморфизм

```cpp
#include <memory>
#include <vector>

std::vector<std::unique_ptr<Shape>> shapes;
shapes.push_back(std::make_unique<Circle>(10.0));

for (const auto& shape : shapes)
{
    std::cout << shape->area() << '\n';
}
```

### Композиция против наследования
Наследование означает отношение "является". `Circle` является `Shape`. Но `Car` не должен наследоваться от `Engine`; машина содержит двигатель. Это композиция.

### Частые ошибки
- Нет виртуального деструктора в базовом классе.
- Наследование ради повторного использования кода, хотя нужна композиция.
- Слишком глубокая иерархия классов.
- Отсутствие `override`.

### Задания
1. Создайте базовый класс `Animal` с виртуальным методом `sound`.
2. Реализуйте `Cat` и `Dog`.
3. Храните животных в `std::vector<std::unique_ptr<Animal>>`.
4. Создайте иерархию `Shape`: `Circle`, `Rectangle`, `Triangle`.
5. Добавьте виртуальный метод `name`.

---

## 19. Шаблоны и generic programming

Шаблоны позволяют писать код, который работает с разными типами.

### Шаблон функции

```cpp
template <typename T>
T maxValue(T a, T b)
{
    return a > b ? a : b;
}
```

Использование:

```cpp
std::cout << maxValue(10, 20) << '\n';
std::cout << maxValue(3.14, 2.71) << '\n';
```

### Шаблон класса

```cpp
template <typename T>
class Box
{
public:
    explicit Box(T value)
        : value_{std::move(value)}
    {
    }

    const T& value() const
    {
        return value_;
    }

private:
    T value_;
};
```

### Ограничения через concepts
C++20 добавил concepts:

```cpp
#include <concepts>

template <std::integral T>
T add(T a, T b)
{
    return a + b;
}
```

Теперь функция принимает только целочисленные типы.

### Почему ошибки шаблонов иногда длинные
Компилятор генерирует код под конкретный тип. Если тип не поддерживает нужную операцию, ошибка может быть большой. Читайте первую содержательную строку и место инстанцирования.

### Задания
1. Напишите шаблон функции `minValue`.
2. Напишите шаблон функции `printVector`.
3. Создайте шаблонный класс `Pair<T, U>`.
4. Напишите функцию `contains`, которая проверяет наличие элемента в `std::vector<T>`.
5. Добавьте concept, ограничивающий функцию только числами.

---

## 20. Стандартная библиотека: контейнеры

### `std::vector`
Основной контейнер. Быстрый доступ по индексу, элементы лежат рядом в памяти.

```cpp
std::vector<int> values{1, 2, 3};
values.push_back(4);
```

### `std::deque`
Двусторонняя очередь. Быстро добавляет в начало и конец.

```cpp
std::deque<int> q;
q.push_back(1);
q.push_front(0);
```

### `std::list`
Двусвязный список. В прикладном C++ используется реже, чем кажется новичкам. Плохая локальность памяти часто делает его медленнее `vector`.

### `std::map`
Отсортированный словарь на дереве.

```cpp
std::map<std::string, int> ages;
ages["Anna"] = 19;
```

### `std::unordered_map`
Хеш-таблица. Обычно быстрее для поиска по ключу, но порядок элементов не гарантирован.

```cpp
std::unordered_map<std::string, int> counter;
++counter["apple"];
```

### `std::set` и `std::unordered_set`
Хранят уникальные значения.

```cpp
std::set<int> uniqueNumbers{3, 1, 2, 2};
```

### Адаптеры
- `std::stack` - стек.
- `std::queue` - очередь.
- `std::priority_queue` - приоритетная очередь.

### Как выбрать контейнер
- Нужен список элементов и частый проход - `std::vector`.
- Нужен быстрый поиск по ключу - `std::unordered_map`.
- Нужен отсортированный порядок ключей - `std::map`.
- Нужны уникальные элементы - `std::set` или `std::unordered_set`.
- Нужна очередь задач - `std::queue`.
- Нужен максимум/минимум с быстрым извлечением - `std::priority_queue`.

### Задания
1. Посчитайте частоту слов в тексте через `std::unordered_map`.
2. Удалите дубликаты чисел через `std::set`.
3. Реализуйте очередь печати через `std::queue`.
4. Реализуйте историю действий через `std::stack`.
5. Найдите топ-3 максимальных числа через `std::priority_queue`.

---

## 21. Итераторы, алгоритмы и ranges

### Итераторы
Итератор - объект, который указывает на элемент контейнера.

```cpp
std::vector<int> values{1, 2, 3};

for (auto it = values.begin(); it != values.end(); ++it)
{
    std::cout << *it << '\n';
}
```

В большинстве случаев проще:

```cpp
for (int value : values)
{
    std::cout << value << '\n';
}
```

### Алгоритмы

```cpp
#include <algorithm>
#include <vector>

std::vector<int> values{5, 1, 4, 2, 3};
std::sort(values.begin(), values.end());
```

Поиск:

```cpp
auto it = std::find(values.begin(), values.end(), 4);

if (it != values.end())
{
    std::cout << "found\n";
}
```

Подсчет:

```cpp
int evens = std::count_if(values.begin(), values.end(), [](int x)
{
    return x % 2 == 0;
});
```

### Лямбды

```cpp
auto isEven = [](int x)
{
    return x % 2 == 0;
};
```

Лямбда - анонимная функция.

### `std::accumulate`

```cpp
#include <numeric>

int sum = std::accumulate(values.begin(), values.end(), 0);
```

### Ranges C++20

```cpp
#include <algorithm>
#include <ranges>
#include <vector>

std::vector<int> values{5, 1, 4, 2, 3};
std::ranges::sort(values);
```

Ranges часто делают код короче и безопаснее, потому что не нужно вручную передавать `begin` и `end`.

### Задания
1. Отсортируйте вектор по возрастанию и убыванию.
2. Найдите первое отрицательное число через `std::find_if`.
3. Посчитайте сумму через `std::accumulate`.
4. Удалите все нечетные числа через `std::remove_if` + `erase`.
5. Отсортируйте список студентов по среднему баллу.
6. Перепишите одну задачу с `std::ranges`.

---

## 22. Файлы и потоки

### Запись в файл

```cpp
#include <fstream>

int main()
{
    std::ofstream out{"data.txt"};
    out << "Hello file\n";
}
```

Файл закрывается автоматически при уничтожении `out`.

### Чтение файла

```cpp
#include <fstream>
#include <iostream>
#include <string>

int main()
{
    std::ifstream in{"data.txt"};

    if (!in)
    {
        std::cout << "Cannot open file\n";
        return 1;
    }

    std::string line;
    while (std::getline(in, line))
    {
        std::cout << line << '\n';
    }
}
```

### CSV без сторонних библиотек

```cpp
#include <sstream>
#include <string>
#include <vector>

std::vector<std::string> splitCsvLine(const std::string& line)
{
    std::vector<std::string> result;
    std::stringstream ss{line};
    std::string item;

    while (std::getline(ss, item, ','))
    {
        result.push_back(item);
    }

    return result;
}
```

Это простой вариант, он не обрабатывает кавычки и запятые внутри полей.

### Пути через `std::filesystem`

```cpp
#include <filesystem>
#include <iostream>

int main()
{
    std::filesystem::path path{"data.txt"};

    if (std::filesystem::exists(path))
    {
        std::cout << std::filesystem::file_size(path) << '\n';
    }
}
```

### Задания
1. Запишите в файл список студентов.
2. Прочитайте файл построчно и выведите строки с номерами.
3. Посчитайте количество строк, слов и символов в файле.
4. Реализуйте простой CSV-список товаров: название, цена, количество.
5. Скопируйте содержимое одного файла в другой.
6. Выведите все `.txt` файлы в текущей папке через `std::filesystem`.

---

## 23. Исключения и обработка ошибок

### Исключения

```cpp
#include <stdexcept>

double divide(double a, double b)
{
    if (b == 0.0)
    {
        throw std::invalid_argument{"division by zero"};
    }

    return a / b;
}
```

Обработка:

```cpp
try
{
    std::cout << divide(10, 0) << '\n';
}
catch (const std::exception& ex)
{
    std::cout << "Error: " << ex.what() << '\n';
}
```

### Когда использовать исключения
Хорошо:
- невозможно открыть обязательный файл конфигурации;
- нарушен контракт функции;
- ошибка должна прервать текущую операцию.

Плохо:
- обычная проверка пользовательского ввода;
- ожидаемый вариант бизнес-логики;
- управление потоком вместо `if`.

### Альтернатива: возвращаем результат

```cpp
#include <optional>

std::optional<int> parsePositive(int value)
{
    if (value <= 0)
    {
        return std::nullopt;
    }

    return value;
}
```

### `std::expected`
В C++23 появился `std::expected`, но доступность зависит от компилятора и стандартной библиотеки. Идея: функция возвращает либо значение, либо ошибку.

### Задания
1. Напишите безопасное деление с исключением.
2. Напишите функцию поиска элемента, возвращающую `std::optional<size_t>`.
3. Обработайте ошибку открытия файла.
4. Объясните, почему не стоит использовать исключения для каждого неправильного ввода пользователя.

---

## 24. Разделение на `.h` и `.cpp`

В маленьких учебных задачах можно писать все в одном `.cpp`. В реальных проектах код разделяют.

### Заголовочный файл `calculator.h`

```cpp
#pragma once

int add(int a, int b);
int subtract(int a, int b);
```

### Файл реализации `calculator.cpp`

```cpp
#include "calculator.h"

int add(int a, int b)
{
    return a + b;
}

int subtract(int a, int b)
{
    return a - b;
}
```

### Использование в `main.cpp`

```cpp
#include <iostream>
#include "calculator.h"

int main()
{
    std::cout << add(2, 3) << '\n';
}
```

### Что писать в `.h`
- объявления функций;
- объявления классов;
- шаблоны;
- `inline` функции, если нужно;
- константы `inline constexpr`.

### Что писать в `.cpp`
- реализации обычных функций;
- реализации методов классов;
- приватные вспомогательные функции для одного файла.

### ODR
ODR - One Definition Rule. У сущности должно быть одно определение в программе. Типичная ошибка новичка: положить обычную функцию в `.h`, подключить этот `.h` в несколько `.cpp` и получить ошибку линковки.

### Задания
1. Создайте проект из трех файлов: `main.cpp`, `math_utils.h`, `math_utils.cpp`.
2. Вынесите функции `square`, `isEven`, `factorial`.
3. Специально определите функцию в `.h`, подключите в два `.cpp` и посмотрите ошибку.
4. Исправьте ошибку правильным разделением объявления и реализации.

---

## 25. Сборка, компилятор, линковщик

### Что происходит при сборке
1. Препроцессор обрабатывает `#include`, `#define`, условную компиляцию.
2. Компилятор превращает каждый `.cpp` в объектный файл.
3. Линковщик объединяет объектные файлы и библиотеки в исполняемый файл.

### Типы ошибок
- **Compile error** - ошибка синтаксиса или типов.
- **Linker error** - компилятор все понял, но линковщик не нашел реализацию.
- **Runtime error** - программа собрана, но падает или работает неверно.
- **Logic error** - программа работает, но результат неправильный.

### Пример ошибки линковки
```cpp
int add(int a, int b);

int main()
{
    return add(2, 3);
}
```

Функция объявлена, но не определена. Visual Studio может выдать `LNK2019 unresolved external symbol`.

### Командная строка MSVC
В Developer PowerShell:

```powershell
cl /std:c++20 /EHsc /W4 main.cpp
```

Запуск:

```powershell
.\main.exe
```

### GCC/Clang
На Linux/macOS или MinGW:

```bash
g++ -std=c++20 -Wall -Wextra -pedantic main.cpp -o app
./app
```

### Задания
1. Соберите один файл через Visual Studio.
2. Соберите тот же файл через `cl` в Developer PowerShell.
3. Создайте ошибку компиляции и ошибку линковки.
4. Объясните разницу между `.cpp`, `.obj`, `.exe`.

---

## 26. CMake и структура проекта

CMake - популярная система описания сборки. Она не компилятор, а генератор проектов для Visual Studio, Ninja, Make и других инструментов.

### Минимальная структура

```text
hello-cmake/
  CMakeLists.txt
  src/
    main.cpp
```

### `CMakeLists.txt`

```cmake
cmake_minimum_required(VERSION 3.24)
project(hello_cmake LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(hello
    src/main.cpp
)
```

### Открытие CMake проекта в Visual Studio
1. **File > Open > Folder**.
2. Выберите папку с `CMakeLists.txt`.
3. Visual Studio сама сконфигурирует проект.
4. Выберите target и нажмите Run.

### Сборка из командной строки

```bash
cmake -S . -B build
cmake --build build
```

### Более реалистичная структура

```text
project/
  CMakeLists.txt
  include/
    app/calculator.h
  src/
    calculator.cpp
    main.cpp
  tests/
    calculator_tests.cpp
```

### Задания
1. Создайте CMake-проект с одним `main.cpp`.
2. Добавьте библиотеку `calculator`.
3. Подключите библиотеку к исполняемому файлу.
4. Откройте папку проекта в Visual Studio.
5. Соберите проект через командную строку.

---

## 27. Сторонние библиотеки и vcpkg

C++ не имеет единого встроенного менеджера пакетов уровня `npm` или `pip`, но в экосистеме часто используют vcpkg, Conan или системные пакеты.

### vcpkg
vcpkg - менеджер C/C++ библиотек от Microsoft.

Типичный сценарий:

```powershell
git clone https://github.com/microsoft/vcpkg
.\vcpkg\bootstrap-vcpkg.bat
.\vcpkg\vcpkg install fmt:x64-windows
```

Интеграция с Visual Studio:

```powershell
.\vcpkg\vcpkg integrate install
```

### Пример библиотеки `fmt`

```cpp
#include <fmt/core.h>

int main()
{
    fmt::print("Hello, {}!\n", "C++");
}
```

### Когда подключать библиотеку
Подключайте библиотеку, если:
- задача стандартная и сложная: JSON, HTTP, GUI, БД, криптография;
- библиотека активно поддерживается;
- лицензия подходит проекту;
- вы понимаете, как ее обновлять и собирать.

### Задания
1. Установите vcpkg.
2. Подключите `fmt` к тестовому проекту.
3. Выведите таблицу товаров через `fmt::print`.
4. Найдите библиотеку для JSON и изучите ее README.

---

## 28. Тестирование

### `assert`

```cpp
#include <cassert>

int add(int a, int b)
{
    return a + b;
}

int main()
{
    assert(add(2, 3) == 5);
}
```

`assert` полезен для простых проверок, но в Release может отключаться.

### Простая ручная проверка

```cpp
void testAdd()
{
    if (add(2, 3) != 5)
    {
        std::cerr << "testAdd failed\n";
    }
}
```

### GoogleTest
В больших C++ проектах часто используют GoogleTest.

Пример теста:

```cpp
#include <gtest/gtest.h>

TEST(CalculatorTests, AddReturnsSum)
{
    EXPECT_EQ(add(2, 3), 5);
}
```

### Что тестировать
- чистые функции;
- граничные случаи;
- ошибки ввода;
- пустые контейнеры;
- отрицательные числа;
- большие значения;
- сериализацию и чтение файлов на маленьких примерах.

### Тестирование в Visual Studio
Visual Studio умеет показывать тесты в **Test Explorer**. Для C++ можно использовать Microsoft Native Unit Test Framework, GoogleTest или CTest с CMake.

### Задания
1. Напишите `assert`-тесты для `factorial`.
2. Проверьте `isPrime` на 1, 2, 3, 4, 17, 18.
3. Напишите тесты для функции поиска минимума в векторе.
4. Подключите GoogleTest или используйте простой самописный runner.
5. Добавьте тесты в CMake через `enable_testing()`.

---

## 29. Отладка и диагностика ошибок

### Типичный процесс отладки
1. Сформулировать, что ожидали.
2. Сформулировать, что получили.
3. Сузить место ошибки.
4. Поставить breakpoint.
5. Проверить значения переменных.
6. Выполнить код пошагово.
7. Исправить причину, а не симптом.

### Watch и Call Stack
Если программа зашла в неожиданную функцию, смотрите **Call Stack**. Если переменная внезапно изменилась, добавьте ее в **Watch**.

### Условный breakpoint
Правой кнопкой по breakpoint:
- **Conditions**;
- условие, например `i == 100`.

Это полезно в циклах.

### AddressSanitizer
AddressSanitizer помогает находить ошибки памяти:
- выход за границы массива;
- use-after-free;
- double-free;
- некоторые виды stack-use-after-scope.

В Visual Studio его можно включить в свойствах проекта, если компонент установлен.

### Статический анализ
В Visual Studio есть **Analyze > Run Code Analysis**. Он помогает найти потенциальные ошибки до запуска программы.

### Задания
1. Создайте ошибку выхода за границы вектора через `operator[]` и найдите ее отладчиком.
2. Перепишите код на `.at()` и посмотрите отличие.
3. Поставьте условный breakpoint внутри цикла.
4. Найдите ошибку в функции факториала, если она возвращает неправильное значение.
5. Включите Code Analysis и прочитайте предупреждения.

---

## 30. Алгоритмы и структуры данных для C++

### Сложность
Оценка сложности показывает, как растет время или память при увеличении входа.

- `O(1)` - константно.
- `O(log n)` - логарифмически.
- `O(n)` - линейно.
- `O(n log n)` - типично для хорошей сортировки.
- `O(n^2)` - квадратично.

### Линейный поиск

```cpp
int findIndex(const std::vector<int>& values, int target)
{
    for (size_t i = 0; i < values.size(); ++i)
    {
        if (values[i] == target)
        {
            return static_cast<int>(i);
        }
    }

    return -1;
}
```

### Бинарный поиск
Работает только на отсортированной последовательности.

```cpp
#include <algorithm>

bool exists = std::binary_search(values.begin(), values.end(), target);
```

### Сортировка

```cpp
std::sort(values.begin(), values.end());
```

Не пишите свою сортировку для production, если нет учебной цели.

### Рекурсия

```cpp
int factorial(int n)
{
    if (n <= 1)
    {
        return 1;
    }

    return n * factorial(n - 1);
}
```

Всегда нужен базовый случай.

### Графы
Простой граф можно хранить как список смежности:

```cpp
std::vector<std::vector<int>> graph;
```

BFS:

```cpp
#include <queue>

std::vector<int> bfs(const std::vector<std::vector<int>>& graph, int start)
{
    std::vector<int> order;
    std::vector<bool> visited(graph.size(), false);
    std::queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty())
    {
        int v = q.front();
        q.pop();
        order.push_back(v);

        for (int to : graph[v])
        {
            if (!visited[to])
            {
                visited[to] = true;
                q.push(to);
            }
        }
    }

    return order;
}
```

### Задания
1. Реализуйте линейный поиск.
2. Реализуйте бинарный поиск вручную.
3. Реализуйте сортировку выбором для учебной цели.
4. Решите задачу на частотный словарь.
5. Реализуйте BFS для графа.
6. Реализуйте DFS рекурсивно.
7. Для каждой задачи оцените сложность.

---

## 31. Move semantics и value categories

Эта тема относится к уровню intermediate, но без нее трудно понимать современный C++.

### Копирование

```cpp
std::string a = "hello";
std::string b = a; // копия
```

### Перемещение

```cpp
std::string a = "hello";
std::string b = std::move(a);
```

После перемещения `a` остается валидной, но ее значение не нужно предполагать. Ее можно присвоить заново или уничтожить.

### Зачем нужно перемещение
Если объект владеет большим ресурсом, перемещение может передать владение без дорогой копии.

### Пример с `vector`

```cpp
std::vector<int> makeData()
{
    std::vector<int> data{1, 2, 3, 4, 5};
    return data;
}
```

Современный компилятор обычно применит copy elision или move.

### Не пишите `std::move` в return без причины

```cpp
std::vector<int> makeData()
{
    std::vector<int> data{1, 2, 3};
    return data; // хорошо
}
```

`return std::move(data);` может мешать оптимизациям.

### Задания
1. Создайте строку и переместите ее в другую.
2. Проверьте, что исходная строка остается валидной.
3. Напишите функцию, возвращающую `std::vector<int>`.
4. Объясните, чем копирование отличается от перемещения.
5. Найдите в документации, какие операции есть у `std::unique_ptr`.

---

## 32. Лямбды, функциональный стиль и callbacks

### Простая лямбда

```cpp
auto add = [](int a, int b)
{
    return a + b;
};
```

### Захват переменных

```cpp
int limit = 10;

auto lessThanLimit = [limit](int value)
{
    return value < limit;
};
```

Захват по значению `[limit]` копирует переменную. Захват по ссылке `[&limit]` хранит ссылку.

### Лямбда в алгоритме

```cpp
std::vector<int> values{1, 2, 3, 4, 5};

auto it = std::find_if(values.begin(), values.end(), [](int x)
{
    return x > 3;
});
```

### `std::function`

```cpp
#include <functional>

void repeat(int times, const std::function<void(int)>& action)
{
    for (int i = 0; i < times; ++i)
    {
        action(i);
    }
}
```

`std::function` удобен, но может быть тяжелее шаблонного параметра. Для учебного уровня это нормально.

### Задания
1. Отсортируйте студентов по имени через лямбду.
2. Отсортируйте студентов по среднему баллу.
3. Напишите функцию `filter`, принимающую предикат.
4. Напишите `repeat`, которая вызывает действие `n` раз.
5. Объясните разницу между захватом `[x]` и `[&x]`.

---

## 33. Многопоточность

Многопоточность нужна, когда программа делает несколько задач параллельно: вычисления, обработка запросов, фоновые задачи. Это сложная тема, требующая осторожности.

### `std::thread`

```cpp
#include <iostream>
#include <thread>

void worker()
{
    std::cout << "work\n";
}

int main()
{
    std::thread t{worker};
    t.join();
}
```

`join` ждет завершения потока. Если забыть `join` или `detach`, программа завершится аварийно.

### `std::mutex`

```cpp
#include <mutex>

std::mutex m;
int counter = 0;

void increment()
{
    std::lock_guard<std::mutex> lock{m};
    ++counter;
}
```

`lock_guard` - RAII-обертка: блокирует mutex в конструкторе и освобождает в деструкторе.

### `std::atomic`

```cpp
#include <atomic>

std::atomic<int> counter{0};

void increment()
{
    ++counter;
}
```

Для простых счетчиков `atomic` часто проще mutex.

### `std::async`

```cpp
#include <future>

int calculate()
{
    return 42;
}

int main()
{
    auto future = std::async(std::launch::async, calculate);
    std::cout << future.get() << '\n';
}
```

### Задания
1. Запустите функцию в отдельном потоке.
2. Создайте два потока, увеличивающих общий счетчик, сначала без mutex, потом с mutex.
3. Перепишите счетчик на `std::atomic<int>`.
4. Используйте `std::async` для вычисления суммы большого вектора.
5. Объясните, что такое race condition.

---

## 34. Производительность и профилирование

### Сначала измеряйте
Не оптимизируйте код только потому, что "кажется медленным". Сначала измерьте.

### Что обычно влияет на производительность
- лишние копии больших объектов;
- плохой выбор контейнера;
- частые выделения памяти;
- неудачная локальность данных;
- неоптимальные алгоритмы;
- синхронизация в многопоточном коде;
- ввод-вывод в горячем цикле.

### Простое измерение времени

```cpp
#include <chrono>
#include <iostream>

int main()
{
    auto start = std::chrono::steady_clock::now();

    long long sum = 0;
    for (int i = 0; i < 10'000'000; ++i)
    {
        sum += i;
    }

    auto end = std::chrono::steady_clock::now();
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);

    std::cout << sum << '\n';
    std::cout << ms.count() << " ms\n";
}
```

### Visual Studio Profiler
В Visual Studio используйте:
- **Debug > Performance Profiler**;
- CPU Usage;
- Memory Usage;
- Instrumentation, если доступно.

### Советы
- Передавайте большие объекты по `const&`.
- Используйте `reserve` для `vector`, если знаете размер.
- Не используйте `std::endl` без необходимости: он делает flush.
- Выбирайте алгоритм до микрооптимизаций.
- Сравнивайте Debug и Release отдельно.

### Задания
1. Сравните время заполнения `vector` с `reserve` и без.
2. Сравните линейный поиск в `vector` и поиск в `unordered_set`.
3. Замерьте сортировку 100000 случайных чисел.
4. Откройте Performance Profiler в Visual Studio.
5. Найдите место, где программа тратит больше всего времени.

---

## 35. Undefined behavior и безопасность

Undefined behavior - ситуация, в которой стандарт C++ не определяет, что должна делать программа. Она может работать, падать, выдавать странный результат или ломаться только в Release.

### Примеры UB

Выход за границы:

```cpp
std::vector<int> v{1, 2, 3};
std::cout << v[10] << '\n';
```

Разыменование `nullptr`:

```cpp
int* p = nullptr;
std::cout << *p << '\n';
```

Использование неинициализированной переменной:

```cpp
int x;
std::cout << x << '\n';
```

Возврат ссылки на локальную переменную:

```cpp
int& bad()
{
    int x = 10;
    return x;
}
```

### Как снижать риск
- Инициализируйте переменные.
- Используйте `.at()` там, где важна проверка границ.
- Включайте warning level `/W4`.
- Используйте AddressSanitizer.
- Избегайте ручного `new`/`delete`.
- Пишите тесты.
- Упрощайте владение ресурсами.

### Задания
1. Найдите 3 примера UB в своем старом коде или учебных примерах.
2. Исправьте выход за границы через проверку индекса.
3. Включите предупреждения и исправьте все warnings.
4. Объясните, почему "у меня работает" не доказывает отсутствие UB.

---

## 36. Современные стандарты C++

### C++11
- `auto`;
- range-based for;
- lambdas;
- move semantics;
- `nullptr`;
- smart pointers;
- `thread`;
- `chrono`.

### C++14
- улучшения generic lambdas;
- `std::make_unique`;
- упрощения constexpr.

### C++17
- structured bindings;
- `std::optional`;
- `std::variant`;
- `std::filesystem`;
- `if constexpr`.

Пример:

```cpp
auto [name, age] = std::pair{std::string{"Anna"}, 19};
```

### C++20
- concepts;
- ranges;
- coroutines;
- modules;
- `std::span`;
- `std::format` в поддерживаемых стандартных библиотеках.

### C++23
- `std::expected`;
- дополнительные ranges;
- улучшения стандартной библиотеки.

### Практический совет
Для учебы сейчас разумно писать на C++20, но знать C++17, потому что много проектов все еще используют его. C++23 изучайте как расширение, проверяя поддержку конкретного компилятора.

### Задания
1. Используйте structured bindings для пары.
2. Используйте `std::optional`.
3. Напишите пример с `if constexpr`.
4. Перепишите сортировку через `std::ranges::sort`.
5. Найдите, поддерживает ли ваша версия MSVC нужную C++23 возможность.

---

## 37. Модули C++20

Модули - современная альтернатива части механики заголовочных файлов. Они могут ускорять сборку и уменьшать проблемы с макросами, но поддержка и практика использования зависят от компилятора и сборочной системы.

Простой пример:

```cpp
export module math;

export int square(int x)
{
    return x * x;
}
```

Использование:

```cpp
import math;
#include <iostream>

int main()
{
    std::cout << square(5) << '\n';
}
```

### Реальность
В учебных и многих production проектах `.h` + `.cpp` все еще встречаются чаще. Модули стоит изучать после уверенного понимания обычной модели компиляции C++.

### Задания
1. Прочитайте документацию вашей IDE по C++ modules.
2. Создайте экспериментальный модуль `math`.
3. Сравните структуру с вариантом через `.h` и `.cpp`.

---

## 38. Работа с Windows и desktop-приложениями

Для старта лучше изучать C++ на консольных программах. Desktop-разработка добавляет отдельную сложность: окна, сообщения, ресурсы, UI-поток.

### Варианты GUI на C++
- Win32 API - низкоуровневый Windows API.
- MFC - старый, но все еще встречающийся framework Microsoft.
- Qt - кроссплатформенный GUI framework.
- wxWidgets - кроссплатформенная библиотека.
- Dear ImGui - immediate mode GUI, часто для инструментов и debug UI.

### Когда переходить к GUI
Переходите после тем:
- функции;
- классы;
- указатели и ссылки;
- события/обработчики;
- сборка и подключение библиотек;
- отладка.

### Учебный маршрут для GUI
1. Консольный калькулятор.
2. Консольный todo-list с файлами.
3. То же приложение с простым GUI.
4. Обработка кнопок, полей ввода, таблицы.
5. Сохранение данных.

### Задания
1. Изучите, какие GUI шаблоны предлагает ваша Visual Studio.
2. Создайте пустой Win32 проект только для эксперимента.
3. Сравните сложность консольного и оконного приложения.
4. Найдите пример минимального Qt Widgets приложения.

---

## 39. Код-стиль и инженерные привычки

### Имена
Выберите стиль и держите его:

```cpp
int studentCount{};
std::string userName;

class BankAccount
{
public:
    double balance() const;

private:
    double balance_{};
};
```

Один распространенный стиль:
- типы: `PascalCase`;
- функции и переменные: `camelCase`;
- приватные поля: `name_`;
- константы: `kMaxRetries` или `maxRetries`, в зависимости от стандарта команды.

### Функции
Хорошая функция:
- делает одну понятную вещь;
- имеет ясное имя;
- не слишком длинная;
- имеет минимальное количество параметров;
- не зависит от глобального состояния без необходимости.

### Заголовки
В `.h` подключайте минимально необходимое. Иногда можно использовать forward declaration.

### Ошибки новичков
1. Писать всю программу в `main`.
2. Использовать глобальные переменные для всего.
3. Игнорировать warnings.
4. Копировать код вместо функции.
5. Писать классы без инвариантов и смысла.
6. Использовать наследование там, где достаточно композиции.
7. Сразу оптимизировать без измерений.
8. Злоупотреблять `using namespace std;`.

### Мини-чеклист перед сдачей задания
- Проект собирается с нуля.
- Нет warnings на `/W4` или вы понимаете каждый warning.
- Есть проверка некорректного ввода.
- Код разбит на функции.
- Нет дублирования крупных блоков.
- Названия переменных понятны.
- Есть минимум несколько тестовых сценариев.

### Задания
1. Возьмите старую программу и разбейте `main` на функции.
2. Переименуйте переменные так, чтобы код читался без комментариев.
3. Включите `/W4` и исправьте warnings.
4. Удалите дублирование через функцию.

---

## 40. Учебные проекты по уровням

### Уровень 1: полный новичок
1. **Анкета студента**: ввод имени, возраста, группы, среднего балла.
2. **Калькулятор**: операции `+`, `-`, `*`, `/`, проверка деления на ноль.
3. **Конвертер единиц**: температура, валюта, расстояние.
4. **Угадай число**: случайное число, количество попыток, подсказки.
5. **Таблица умножения**: форматированный вывод.

### Уровень 2: функции и контейнеры
1. **Журнал оценок**: вектор оценок, средний балл, минимум, максимум.
2. **Список покупок**: добавить, удалить, отметить купленным.
3. **Анализатор текста**: количество слов, букв, цифр, частотный словарь.
4. **Менеджер контактов**: имя, телефон, поиск по имени.
5. **Мини-статистика**: медиана, среднее, дисперсия.

### Уровень 3: файлы и классы
1. **Todo-list с сохранением**: задачи пишутся в файл и читаются при запуске.
2. **Библиотека книг**: `Book`, `Library`, поиск, фильтры, сохранение CSV.
3. **Банковские счета**: классы, операции, история транзакций.
4. **Склад товаров**: товар, количество, цена, отчеты.
5. **Расписание занятий**: день недели, аудитория, преподаватель.

### Уровень 4: ООП, STL, тесты
1. **Фигуры**: базовый класс `Shape`, площади, периметры, полиморфизм.
2. **Файловый индексатор**: обход папки, поиск файлов по расширению.
3. **Парсер CSV**: чтение таблицы, фильтрация, сортировка.
4. **CLI заметки**: команды `add`, `list`, `done`, `remove`, хранение в файле.
5. **Мини-игра**: поле, игрок, враги, состояние игры.

### Уровень 5: intermediate
1. **Task manager**: приоритетная очередь задач, дедлайны, сохранение.
2. **Лог-анализатор**: чтение большого файла, статистика ошибок.
3. **Многопоточный подсчет слов**: разделение файла на части.
4. **CMake библиотека**: библиотека + исполняемый файл + тесты.
5. **Pet-проект с vcpkg**: JSON конфигурация, форматированный вывод, тесты.

---

## 41. Большой итоговый проект: консольный менеджер задач

### Требования
Приложение должно поддерживать:
- добавление задачи;
- список задач;
- отметку выполнения;
- удаление;
- поиск по тексту;
- приоритет;
- дедлайн строкой;
- сохранение в файл;
- загрузку из файла при старте;
- обработку некорректного ввода.

### Модель

```cpp
enum class Priority
{
    Low,
    Normal,
    High
};

struct Task
{
    int id{};
    std::string title;
    Priority priority{Priority::Normal};
    bool done{false};
    std::string deadline;
};
```

### Архитектура
Минимальные компоненты:
- `Task` - данные задачи;
- `TaskRepository` - хранение в памяти и файле;
- `TaskService` - бизнес-операции;
- `ConsoleUi` - ввод и вывод;
- `main` - сборка приложения.

### Команды
```text
add
list
done <id>
remove <id>
find <text>
save
exit
```

### Этапы реализации
1. Сделать модель `Task`.
2. Сделать хранение в `std::vector<Task>`.
3. Реализовать добавление и вывод.
4. Добавить поиск.
5. Добавить сохранение в файл.
6. Добавить загрузку.
7. Разбить код на `.h` и `.cpp`.
8. Добавить тесты для логики.
9. Добавить CMake.
10. Провести ручное тестирование.

### Дополнительные усложнения
- сортировка по приоритету;
- фильтр выполненных/невыполненных;
- экспорт CSV;
- импорт CSV;
- логирование действий;
- конфиг-файл;
- поддержка аргументов командной строки.

---

## 42. Дорожная карта изучения

### Этап 1. Вход в язык
- установка Visual Studio;
- структура программы;
- типы;
- ввод/вывод;
- условия;
- циклы;
- функции.

Результат: студент пишет простые консольные программы без подсказок.

### Этап 2. Данные и декомпозиция
- `std::string`;
- `std::vector`;
- функции с параметрами;
- структуры;
- файлы;
- базовая обработка ошибок.

Результат: студент умеет хранить списки данных, обрабатывать их и сохранять.

### Этап 3. Объектная модель
- классы;
- инкапсуляция;
- конструкторы;
- RAII;
- наследование;
- полиморфизм;
- композиция.

Результат: студент может спроектировать небольшое приложение из классов.

### Этап 4. Современный C++
- STL контейнеры;
- алгоритмы;
- лямбды;
- `optional`;
- smart pointers;
- templates;
- move semantics.

Результат: студент пишет более идиоматичный C++, а не C с классами.

### Этап 5. Инженерная практика
- Git;
- CMake;
- тестирование;
- отладка;
- профилирование;
- сторонние библиотеки;
- code style;
- предупреждения компилятора.

Результат: студент готов к небольшим командным проектам.

### Этап 6. Продвинутые темы
- многопоточность;
- корутины;
- ranges глубже;
- modules;
- allocator-aware programming;
- ABI;
- низкоуровневая оптимизация;
- шаблонная метапрограммация;
- системное программирование.

Эти темы не нужны в первый месяц, но важны для роста.

---

## 43. Контрольные вопросы

1. Что делает компилятор, а что делает линковщик?
2. Чем Debug отличается от Release?
3. Почему `std::vector` предпочтительнее динамического массива через `new[]`?
4. Чем ссылка отличается от указателя?
5. Что такое RAII?
6. Почему у базового полиморфного класса должен быть виртуальный деструктор?
7. Когда стоит использовать `std::unique_ptr`, а когда `std::shared_ptr`?
8. Что такое undefined behavior?
9. Как работает `std::sort` с пользовательским компаратором?
10. Чем `std::map` отличается от `std::unordered_map`?
11. Почему не стоит писать `using namespace std;` в `.h` файлах?
12. Что такое ODR?
13. Как найти ошибку LNK2019?
14. Что такое move semantics?
15. Почему warnings нельзя игнорировать?

---

## 44. Частые ошибки новичков и быстрые исправления

### Ошибка: забыта точка с запятой

```cpp
int x = 10
```

Исправление:

```cpp
int x = 10;
```

### Ошибка: сравнение через `=`

```cpp
if (x = 10)
{
}
```

Исправление:

```cpp
if (x == 10)
{
}
```

### Ошибка: деление целых

```cpp
double average = sum / count;
```

Исправление:

```cpp
double average = static_cast<double>(sum) / count;
```

### Ошибка: выход за границы

```cpp
for (size_t i = 0; i <= values.size(); ++i)
{
    std::cout << values[i] << '\n';
}
```

Исправление:

```cpp
for (size_t i = 0; i < values.size(); ++i)
{
    std::cout << values[i] << '\n';
}
```

### Ошибка: неинициализированная переменная

```cpp
int x;
std::cout << x << '\n';
```

Исправление:

```cpp
int x{};
std::cout << x << '\n';
```

### Ошибка: потеря данных при преобразовании

```cpp
int value = 3.14;
```

Исправление:

```cpp
double value = 3.14;
```

### Ошибка: ручное управление памятью без необходимости

```cpp
int* data = new int[100];
delete[] data;
```

Исправление:

```cpp
std::vector<int> data(100);
```

---

## 45. Ресурсы для продолжения

### Документация
- Microsoft Learn: Visual Studio C++ documentation.
- cppreference.com - справочник по языку и стандартной библиотеке.
- ISO C++ Foundation: isocpp.org.

### Книги
- Bjarne Stroustrup - *Programming: Principles and Practice Using C++*.
- Bjarne Stroustrup - *A Tour of C++*.
- Stanley Lippman, Josée Lajoie, Barbara Moo - *C++ Primer*.
- Scott Meyers - *Effective Modern C++*.
- Nicolai Josuttis - *The C++ Standard Library*.

### Практика
- Exercism C++ track.
- Codeforces для алгоритмов.
- LeetCode для структур данных.
- Advent of Code для ежегодной практики.
- Собственные pet-проекты.

### Минимальный следующий план на 30 дней
1. Неделя 1: Visual Studio, ввод/вывод, условия, циклы.
2. Неделя 2: функции, строки, `vector`, простые алгоритмы.
3. Неделя 3: структуры, классы, файлы, ошибки.
4. Неделя 4: STL, тесты, CMake, итоговый todo-проект.

Главный критерий прогресса: не количество прочитанных разделов, а количество программ, которые вы написали, отладили и улучшили.

