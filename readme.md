# Blocker

A Tetris/Bubble Witch-like game.

Uses Babel in the browser for ES2016 JavaScript goodness.

Have a [quick look here](http://adrianblynch.github.io/blocker/).

## To start

Get the code `git clone https://github.com/adrianblynch/blocker`

Get into the directory `cd blocker`

Fire up a web server `python -m SimpleHTTPServer`

Browse to `http://localhost:8000/`


## Notes

The blocks are aware of their position:
```
{
	x: 1,
	y: 1,
	colour:
	'yellow'
}
```

Blocks are stored in the `Grid` in an array but this doesn't matter for their position:
```
[
	{ x: 1, y: 1, colour: 'yellow' },
	{ x: 4, y: 3, colour: 'blue' },
	...
]
```

`Game.render()` takes the blocks and positions them on screen, or not if they're dead.

Due to blocks not being stored in a 2D array, accessing blocks means a complete pass through of the blocks array each time.
