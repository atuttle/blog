---
title: "Navigating VSCode's File Explorer panel without your mouse"
desc: "VSCode is an incredibly productive IDE, but ⌘P can only take you so far. Nobody was sharing keyboard shortcuts/tips for navigating the Explorer panel, so I figured it out for myself, and I'm sharing it here."
img: /img/2024/kristina-tamasauskaite-VNXhUxPOL4c-unsplash.jpg
date: 2024-08-29 16:30:00
tags:
  - vscode
  - productivity
---

![A very old typewriter](/img/2024/kristina-tamasauskaite-VNXhUxPOL4c-unsplash.jpg)

Photo by <a href="https://unsplash.com/@rani33?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Kristina Tamašauskaitė</a> on <a href="https://unsplash.com/photos/black-typewriter-on-table-VNXhUxPOL4c?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>{class="photo-byline"}

Search youtube/twitter/instagram and you'll find 1,000 people peddling the same keyboard shortcuts for VSCode: Cmd+D for multi-select, duplicating lines, and so on. Once you master those basics, you eventually figure out that most of the time that you're wasting in VSCode with your mouse is spent poking around the File Explorer panel. There are system keyboard shortcuts for it, but they're not all intuitive, and I couldn't find anyone explaining them... So here I am creating the change I want to see in the world.

## Out of the box

<table class="kbd-list">
	<tr>
		<td><kbd>⌘</kbd><kbd>⇧</kbd><kbd>E</kbd></td>
		<td>Show/Focus explorer panel (folders view), or toggle back to focusing the editor panel if focus is currently in explorer</td>
	</tr>
	<tr>
		<td><kbd>↑</kbd> / <kbd>↓</kbd></td>
		<td>Move cursor up/down</td>
	</tr>
	<tr>
		<td><kbd>→</kbd> / <kbd>←</kbd></td>
		<td>Expand/collapse folder</td>
	</tr>
	<tr>
		<td><kbd>⌘</kbd><kbd>↓</kbd></td>
		<td>Open selected file for editing, and focus it</td>
	</tr>
	<tr>
		<td><kbd>space</kbd></td>
		<td>Open selected file for editing, but keep focus in explorer</td>
	</tr>
	<tr>
		<td><kbd>^</kbd><kbd>return</kbd></td>
		<td>Open file to side (split view)</td>
	</tr>
	<tr>
		<td><kbd>return</kbd></td>
		<td>Rename file/folder</td>
	</tr>
	<tr>
		<td><kbd>⌘</kbd><kbd>backspace</kbd></td>
		<td>Delete selected file (to system trash)</td>
	</tr>
	<tr>
		<td><kbd>⇧</kbd><kbd>⌥</kbd><kbd>F</kbd></td>
		<td>Find in folder (search contents of files in current folder)</td>
	</tr>
	<tr>
		<td><kbd>⌘</kbd><kbd>⌥</kbd><kbd>F</kbd></td>
		<td>Filter explorer view (unfortunately, does not search in collapsed folders)</td>
	</tr>
	<tr>
		<td nowrap valign="top"><kbd>⇧</kbd><kbd>↑</kbd>/<kbd>⇧</kbd><kbd>↓</kbd></td>
		<td>Expand selection up/down (your selections don't have to be continuous. Let go of shift, hit up/down a few times, and then add shift to add to the selection.)</td>
	</tr>
	<tr>
		<td><kbd>esc</kbd></td>
		<td>Cancel selection</td>
	</tr>
</table>

## Custom shortcuts

🤘🏻-tip: Map <kbd>caps lock</kbd> to <kbd>^ ctrl</kbd><kbd>⇧ shift</kbd><kbd>⌥ opt</kbd><kbd>⌘ cmd</kbd> using [Karabiner-Elements][ke]. This is often called the "hyper" key, and I'll refer to it here as <kbd>⭐</kbd>. Nobody uses caps lock any more anyway, right?

[ke]: https://karabiner-elements.pqrs.org/

---

<kbd>⌘</kbd><kbd>E</kbd> Show/Focus the file explorer panel. (Same as <kbd>⌘</kbd><kbd>⇧</kbd><kbd>E</kbd>, but without the Shift modifier.) I use this often so I wanted a simpler shortcut.

```json
{ "key": "cmd+e", "command": "workbench.explorer.fileView.focus" }
```

<kbd>⭐</kbd><kbd>C</kbd> Collapse all folders

```json
{ "key": "ctrl+shift+alt+cmd+c", "command": "workbench.files.action.collapseExplorerFolders" }
```

<kbd>⌘</kbd><kbd>N</kbd> New file in current folder

```json
{ "key": "cmd+n", "command": "explorer.newFile" }
```

<kbd>⌥</kbd><kbd>N</kbd> New folder in current folder

```json
{ "key": "alt+n", "command": "explorer.newFolder" }
```

<kbd>⭐</kbd><kbd>F</kbd> Reveal active file in explorer

```json
{ "key": "ctrl+shift+alt+cmd+f", "command": "workbench.files.action.showActiveFileInExplorer" }
```

<style>
	.kbd-list td {
		padding-top: 1em;
	}
	.kbd-list td:first-child {
		white-space: nowrap;
		text-align: right;
		padding-right: 1em;
	}
</style>
