---
title: "My Sublime Keymap & Common KB Shortcuts"
summary: "My Sublime Keymap & Common KB Shortcuts..."
date: 2013-03-08 08:06:26
tags:
  - meta
  - sublime
commentsPostId: My-Sublime-Keymap-Common-KB-Shortcuts
---

What follows is nothing new or unique; it's just a collection of keyboard shortcuts and tips that I've picked up from various blog posts, videos, and personal recommendations from friends over the last ~year of using Sublime full time. I'll go over each setting on its own here in the post, but if you just want the keybindings, [you can find them in this gist](https://gist.github.com/atuttle/5111814).

> **Comma first!** You'll notice that I'm using a comma-first formatting. I like it because it makes missing (or superfluous, in the case of the first line) commas stick out like a sore thumb. You don't have to like it or use it, but it suits me well.

### Line swapping

	{ "keys": ["alt+up"], "command": "swap_line_up" }
	,{ "keys": ["alt+down"], "command": "swap_line_down" }

Alt+up / Alt+down to move lines up or down. This is a neat trick I picked up from Eclipse back in the day, and I use it a lot; especially to move large chunks of code -- just highlight several lines and use it.

### Duplicate line

	,{ "keys": ["ctrl+alt+down"], "command": "duplicate_line" }

Ctrl + Alt + Down creates a copy of the current line on the next line.

**Pro-tip:** If you have less than 1 line selected, that text is duplicated and placed after the selection. No more copy+paste to create a quick series of `<br/>`...

### Delete line

	,{ "keys": ["alt+d"], "command": "run_macro_file", "args": {"file": "Packages/Default/Delete Line.sublime-macro"} }

Another favorite shortcut from Eclipse was Cmd+D; but Sublime does something <del>else</del> **better** with Cmd+D, so with a little effort I re-trained my brain to use Alt+D instead.

### Split View

	,{
		"keys": ["ctrl+alt+left"]
		,"command": "set_layout"
		,"args": {
			"cols": [0.0, 0.75, 1.0]
			,"rows": [0.0, 1.0]
			,"cells": [[0, 0, 1, 1], [1, 0, 2, 1]]
		}
	}
	,{
		"keys": ["ctrl+alt+right"]
		,"command": "set_layout"
		,"args": {
			"cols": [0.0, 0.25, 1.0]
			,"rows": [0.0, 1.0]
			,"cells": [[0, 0, 1, 1], [1, 0, 2, 1]]
		}
	}

_I don't always use split view, but when I do, it's **F&^%ing useful**._

I use the above commands in conjunction with the built-in commands for Super+Alt+1/2/... Using Super+Alt+2 puts you in split-mode with each side taking up 50%, but sometimes you want to focus more on one side or the other. For instance, maybe your CSS is nice and tidy and doesn't need much horizontal space, so you want to give that available space to the HTML on the other side. With the above additions, Ctrl+Alt+Right gives 75% of the code's screen real estate to the right pane and 25% to the left (think "focus right") and Ctrl+Alt+Left ("focus left") gives 75% to the left pane and 25% to the right. Rarely do I ever need 3 panes, but when I do I just resort to the mouse for any resizing that needs to be done.

**Pro-tip:** Use Super+K+B to toggle off the file navigator for even more screen real estate during split view.

In addition to the above shortcuts that arrange panes, these move the cursor to the specified pane (e.g. super+1 focuses the left-most pane, super+2 focuses the 2nd pane from the left, etc):

	,{ "keys": ["super+1"], "command": "focus_group", "args": { "group": 0 } }
	,{ "keys": ["super+2"], "command": "focus_group", "args": { "group": 1 } }
	,{ "keys": ["super+3"], "command": "focus_group", "args": { "group": 2 } }
	,{ "keys": ["super+4"], "command": "focus_group", "args": { "group": 3 } }

And these shortcuts move the focused file to the specified pane:

	,{ "keys": ["alt+1"], "command": "move_to_group", "args": { "group": 0 } }
	,{ "keys": ["alt+2"], "command": "move_to_group", "args": { "group": 1 } }
	,{ "keys": ["alt+3"], "command": "move_to_group", "args": { "group": 2 } }
	,{ "keys": ["alt+4"], "command": "move_to_group", "args": { "group": 3 } }

### Bookmarks

	,{ "keys": ["f3"], "command": "next_bookmark" }
	,{ "keys": ["shift+f3"], "command": "prev_bookmark" }
	,{ "keys": ["super+f3"], "command": "toggle_bookmark" }
	,{ "keys": ["super+shift+f3"], "command": "clear_bookmarks" }
	,{ "keys": ["alt+f3"], "command": "select_all_bookmarks" }

Bookmarks are crazy-useful when you find yourself jumping back and forth around a long file. When working on an app with a _long_ Mach-II.xml file I'll often bookmark the section of events that I'm working on, and views, and listeners, so that I can quickly jump back and forth between these sections.

All of these are modifications to the built-in bookmark settings because I use a plugin called [Sidebar Enhancements](https://github.com/titoBouzout/SideBarEnhancements) to add in some extra functionality for improving keyboard-focused workflow, and it overrides the default F2 shortcut for flipping between bookmarks into a rename-focused-file action. I spent many years on Windows, so I'm actually quite happy to have this action and F2 is easily remembered because Windows uses F2 for file renames; so I just bumped everything for bookmarks up to F3 instead.

### Create XML/HTML Tag Pair

	,{ "keys": ["alt+,"], "command": "insert_snippet", "args": { "name": "Packages/XML/long-tag.sublime-snippet" } }

This is another re-mapping of built-in functionality. By default the shortcut for this is Ctrl+Shift+W, but I found that awkward to perform, so I switched it to Alt+&lt; (it's really Alt+, but I think of it as Alt+&lt; because I'm creating a tag-pair). This is a very handy tool, because it changes the closing tag to match the opening tag as you type. It defaults to a P, but the "p" portion is highlighted and if you overwrite that to "div" then the closing tag automatically becomes `</div>`. Another great thing about this is that when you hit space and start adding tag attributes, they are _not_ added to the closing tag. It's one of those elegant moments where everything just works perfectly. I love this shortcut!

## Other Keyboard Shortcuts

Quickly, here's a list of other built-in shortcuts that I find myself doing all day, every day:

 * Super+K+B toggles the file navigator
 * Super+P opens file search. File search is _super_ powerful!
    * Fuzzy matching: you don't have to spell perfectly or even do consecutive chunks. Say I wanted to open "RecruitWeb.less" but I have 3 of them in different folders, named main, mobile, and new. If I hit Super+P and start typing "mobrecrless" it matches mobile/RecruitWeb.less.
    * Line-jumps: Jumping into a file to fix a bug and you know the line number? select your file with fuzzy matching then add a colon and the line number: "mobrecrless:47" puts your cursor on line 47 of the file you choose.
    * Symbol search: Instead of using a colon to jump to a specific line, say you know the CSS selector you want to modify but you don't know where it is in the file. Use "@" and start typing the selector: "mobrecrless@.ui-widget"
 * Super+Shift+P opens the command palette, from which you can run package control, or toggle the minimap, or execute just about any command for which you can't remember the keyboard shortcut. This uses fuzzy matching as well.
 * Super+Alt+Left/Right flip between open tabs


## Plugins Without Which I Can't Live

 * **[Package Control](http://wbond.net/sublime_packages/package_control):** Don't leave home without it! Use this to install and enable/disable other plugins. Very handy! And the reason I won't include links to the rest of these plugins, because you can just search for them on Package Control.
 * **Sidebar Enhancements:** Adds the aforementioned F2 to rename, confirm deletes, and many other goodies
 * **Advanced New File:** Super+Alt+N to create a new file and you can type out its path relative to the project root, so if I have a project open and type "assets/less/style.less" it will create style.less at the specified location within the project, creating any of the folders necessary in that path (and open the file for editing).
 * **Gist:** I store all of my snippets in [their own github account](https://gist.github.com/atuttle-snippets) so that they are not tied to my editor, and they can be shared, forked, and collaborated on. There is a small latency initiating an "insert gist" command while it indexes my available snippets, but I find that I use them infrequently enough that it doesn't bother me. If I used them more regularly I would probably do something local. Using gists also means I don't have to use the sublime snippet syntax, which is not difficult, but it is another set of (minor) "lock-in" that I would have to go back and remove if/when I move on to another editor in the future.
 * **Live Reload:** because refreshing pages to see your changes is for chumps.
 * **Markdown:** I write a lot of things in [markdown](http://daringfireball.net/projects/markdown/), including blog posts here and elsewhere, articles for things like [Learn CF In A Week](http://learncfinaweek.com/), and so on. It's become a core part of how I write. This plugin adds syntax highlighting for Markdown.

I think that about covers it... for now. I seem to be continuously evolving how I use Sublime, which is a tremendous part of what makes it so useful: you can mold it to the way you like to work.
