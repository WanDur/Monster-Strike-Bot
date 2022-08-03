#include <iostream>
#include<conio.h>

int main()
{
	std::cout << "\tPress y to launch the bot." << std::endl;
	std::cout << "\tor n to quit." << std::endl;

	char choice = _getch();

	if (choice == 'y')
	{
		system("script\\main.py");
	}
	else if (choice == 'n')
	{
		exit(0);
	}

	system("pause");
}