class Game {

	constructor(columns, rows, el) {

		this.grid = new Grid()
		this.el = el
		this.blockWidth = 100
		this.blockHeight = 100
		this.clicks = 0

		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
				const block = new Block(x, y, this.getRandomColour())
				this.grid.addBlock(block)
			}
		}

	}

	getRandomColour() {
		const colours = ['maroon', 'magenta', 'cyan', 'yellow']
		return colours[Math.floor(Math.random() * colours.length)]
	}

	blockClicked(event, block) {
		this.clicks++
		this.grid.getConnectedBlocks(block).map(block => block.kill())
		this.grid.refresh()
		this.renderGrid()

	}

	renderGrid(el = this.el) {

		el.innerHTML = ''

		this.grid.blocks.forEach(block => {

			if (block.live) {
				const blockEl = document.createElement('div')
				blockEl.className = 'block'
				blockEl.style.width = this.blockWidth + 'px'
				blockEl.style.height = this.blockHeight + 'px'
				blockEl.style.left = (block.x * this.blockWidth) + 'px'
				blockEl.style.top = (block.y * this.blockHeight) + 'px'
				blockEl.style.backgroundColor = block.colour
				// Debug the coords
				// blockEl.innerHTML = '<span style="background-color: #000">' + [block.x, block.y] + '</span>'
				blockEl.addEventListener('click', event => this.blockClicked(event, block));
				el.appendChild(blockEl)
			}

		})

		if (this.isGameOver()) {
			this.renderGameOver()
		}

	}

	renderGameOver(el = this.el) {

		el.innerHTML = ''

		const endScreenEl = document.createElement('div')
		endScreenEl.innerHTML = `
			<p>GAME OVER</p>
			<p>Blocks: ${ this.grid.blocks.length }</p>
			<p>Clicks: ${ this.clicks }</p>
			<p>Ratio: ${ this.getClickRatio() }</p>
			<p><a href="">Play again</a></p>
		`
		el.appendChild(endScreenEl)

	}

	getClickRatio() {
		return this.clicks / this.grid.blocks.length
	}

	start() {
		this.renderGrid()
	}

	isGameOver() {
		return this.grid.isEmpty()
	}

}

class Grid {

	constructor(blocks) {
		this.blocks = []
	}

	addBlock(block) {
		this.blocks.push(block)
	}

	getConnectedBlocks(block, blocks = []) {

		this.getAdjacentBlocks(block).forEach(adjBlock => {
			if (blocks.indexOf(adjBlock) === -1) {
				blocks.push(adjBlock)
				this.getConnectedBlocks(adjBlock, blocks)
			}
		})

		return [block, ...blocks]

	}

	getAdjacentBlocks(sourceBlock) {

		let top, right, bottom, left

		this.blocks.forEach(block => {

			if (block.x === sourceBlock.x && block.y === sourceBlock.y - 1) {
				top = block
			} else if (block.x === sourceBlock.x && block.y === sourceBlock.y + 1) {
				bottom = block
			} else if (block.y === sourceBlock.y && block.x === sourceBlock.x - 1) {
				left = block
			} else if (block.y === sourceBlock.y && block.x === sourceBlock.x + 1) {
				right = block
			}

		})

		return [top, right, bottom, left]
			.filter(block => block)
			.filter(block => block.colour === sourceBlock.colour)

	}

	getColumns() {
		return this.blocks.reduce((columns, block, i) => {
			const x = block.x
			columns[x] ? columns[x].push(block) : columns[x] = [block]
			return columns
		}, {})
	}

	refresh(direction = 'down') {

		// Parse the blocks and close any gaps in columns

		const columns = this.getColumns()

		for (let x in columns) {

			const blocks = columns[x]

			// Force dead blocks out of the column
			blocks.forEach(block => {
				if (!block.live) {
					block.y = -1
				}
			})

			// Force dead blocks to top of column
			blocks.sort((a, b) => a.y - b.y)

			// Re-index based on y property
			blocks.forEach((block, index) =>
				block.y = index
			)

		}

	}

	isEmpty() {
		return this.blocks.filter(block => block.live).length === 0
	}

}

class Block {

	constructor(x, y, colour) {
		this.x = x
		this.y = y
		this.colour = colour
		this.live = true
	}

	kill() {
		this.live = false
	}

}

const game = new Game(5, 5, document.getElementById('game'))
game.start()
