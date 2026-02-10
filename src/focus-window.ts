import { showHUD, WindowManagement } from "@raycast/api";
import { exec } from "child_process";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function main() {
	const activeWindow = await WindowManagement.getActiveWindow();
	
	// Minimize all windows
	exec(
    	`powershell -NoProfile -Command "$shell = New-Object -ComObject Shell.Application; $shell.MinimizeAll()"`
  	);

	await showHUD("Focusing '" + activeWindow.application?.name + "'");

	// Restore using hwnd and the windows API (https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow)
	const hwnd = activeWindow.id;
	exec(
		`powershell -NoProfile -Command "Add-Type 'using System; using System.Runtime.InteropServices; public class W{[DllImport(\\\"user32.dll\\\")] public static extern bool ShowWindow(IntPtr h,int c);}'; [W]::ShowWindow([IntPtr]${hwnd},9)"`
	);
}