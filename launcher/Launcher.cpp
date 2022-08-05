#include <iostream>
#include <conio.h>

int main()
{
	std::cout << "Make sure the game is opened.\n\n";
	std::cout << "- 1 will launch the bot directly.\n- 2 will check game window then launch the bot.\n" << std::endl;
	std::cout << "\t1) Launch the bot" << std::endl;
	std::cout << "\t2) Launch bot with check" << std::endl;
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
		int code = system("script\\test.py");

		if (code == 0)
		{
			system("cls");
			system("script\\main.py");
		}
	}
	else if (choice == '3')
	{
		exit(0);
	}

	system("pause");
}