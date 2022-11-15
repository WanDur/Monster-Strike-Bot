#include <iostream>
#include <conio.h>

int main()
{
	std::cout << "Make sure the game is opened.\n\n";
	std::cout << "- 1 will launch the bot directly.\n- 2 will launch the bot assuming shortcut is on. And reduce the time of waiting.\n" << std::endl;
	std::cout << "\t1) Normal mode" << std::endl;
	std::cout << "\t2) Speed mode" << std::endl;
	std::cout << "\t3) Exit" << std::endl;

	char choice = _getch();

	if (choice == '1')
	{
		system("cls");
		system("script\\main.py");
	}
	else if (choice == '2')
	{
		system("cls");
		system("script\\main2.py");
	}
	else if (choice == '3')
	{
		exit(0);
	}

	system("pause");
}