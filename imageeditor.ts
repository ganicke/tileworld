namespace tileWorldEditor {
    const colorCursor = img`
        5 5 5 5 5 5 5 5
        5 . . . . . . 5
        5 . . . . . . 5
        5 . . . . . . 5
        5 . . . . . . 5
        5 . . . . . . 5
        5 . . . . . . 5
        5 5 5 5 5 5 5 5
    `
    const paintCursor = img`
        5 5 5 5 5 5
        5 . . . . 5
        5 . . . . 5
        5 . . . . 5
        5 . . . . 5
        5 5 5 5 5 5
    `
    const colorSize = 8;
    const paintSize = 6;
    export class ImageEditor {
        private color: boolean;
        private colorCursor: Sprite;
        private paintCursor: Sprite;
        private selectedColor: number;
        private original: Image; // 16x16
        private image: Image;    // 16x16
        private tileMap: Image;  // whole screen
        constructor(i: Image) {
            this.color = true;
            this.colorCursor = sprites.create(colorCursor)
            this.colorCursor.x = colorSize >> 1
            this.colorCursor.y = colorSize << 1
            this.selectedColor = 0;
            this.paintCursor = sprites.create(paintCursor)
            this.paintCursor.x = paintSize * 5 + 2 
            this.paintCursor.y = paintSize * 2 + 2
            this.paintCursor.setFlag(SpriteFlag.Invisible, true)
            this.original = i;
            this.image = i.clone();
            this.tileMap = image.create(160, 120)
            scene.setBackgroundImage(this.tileMap)
            controller.left.onEvent(ControllerButtonEvent.Pressed, () => {
                if (this.color) {
                    if (this.colorCursor.x > colorSize)
                        this.colorCursor.x -= colorSize
                } else {
                    if (this.paintCursor.x > paintSize * 6 - 1)
                        this.paintCursor.x -= paintSize
                    else {
                        // transition cursor to color editor
                        this.colorCursor.setFlag(SpriteFlag.Invisible, false)
                        this.paintCursor.setFlag(SpriteFlag.Invisible, true)
                        this.color = true;
                    }
                }
            })
            controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
                if (this.color) {
                    if (this.colorCursor.x < colorSize)
                        this.colorCursor.x += colorSize
                    else {
                        // transition cursor to paint editor
                        this.colorCursor.setFlag(SpriteFlag.Invisible, true)
                        this.paintCursor.setFlag(SpriteFlag.Invisible, false)
                        this.color = false;
                    }
                } else {
                    if (this.paintCursor.x < (paintSize*5 +2) + paintSize * 15)
                        this.paintCursor.x += paintSize
                }
            })
            controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
                if (this.color) {
                    if (this.colorCursor.y > (colorSize << 1) + (colorSize-1))
                        this.colorCursor.y -= colorSize
                } else {
                    if (this.paintCursor.y > (paintSize * 3 + 1))
                        this.paintCursor.y -= paintSize
                }
            })
            controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
                if (this.color) {
                    if (this.colorCursor.y < (colorSize << 1) + colorSize * (colorSize-1))
                        this.colorCursor.y += colorSize
                } else {
                    if (this.paintCursor.y < (paintSize*2) + 2 + paintSize * 15)
                        this.paintCursor.y += paintSize
                }
            })
            controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
                if (this.color) {
                    let col = ((this.colorCursor.x) / colorSize ) | 0x0
                    let row = ((this.colorCursor.y - (colorSize << 1)) / colorSize) | 0x0
                    this.selectedColor = row * 2 + col
                    this.update()
                } else {
                    let col = ((this.paintCursor.x - (paintSize*5 + 2)) / paintSize) | 0x0
                    let row = ((this.paintCursor.y - (paintSize*2 + 2)) / paintSize) | 0x0
                    this.image.setPixel(col, row, this.selectedColor)
                    this.update()
                }
            })
            this.update()
        }
        private update() {
            this.tileMap.fill(0)
            // draw the 16 colors
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 2; col++) {
                    let color = row * 2 + col
                    let yOffset = colorSize + (colorSize >> 1)
                    this.tileMap.fillRect(col * colorSize + 1, yOffset + row * colorSize + 1, colorSize-2, colorSize-2, color)
                    if (this.selectedColor == color) {
                        this.tileMap.drawRect(col * colorSize, yOffset + row * colorSize, colorSize, colorSize, 1)
                    }
                }
            }
            // take care of transparent
            this.tileMap.fillRect(1, 13, 3, 3, 13)
            this.tileMap.fillRect(4, 16, 3, 3, 13)
            // frame the sprite editor
            this.tileMap.drawRect(28, 10, paintSize * 16 + (paintSize - 2), paintSize * 16 + (paintSize -2), 1)
            // draw the sprite editor
            for (let row = 0; row < this.image.height; row++) {
                let y = (paintSize << 1) + row * paintSize
                for (let col = 0; col < this.image.width; col++) {
                    let x = paintSize * 5 + col * paintSize
                    let color = this.image.getPixel(col, row)
                    this.tileMap.fillRect(x, y, paintSize-1, paintSize-1, color)
                    if (color == 0) {
                        this.tileMap.fillRect(x, y, (paintSize >> 1) -1, (paintSize >> 1) -1, 13)
                        this.tileMap.fillRect(x + (paintSize >> 1), y + (paintSize >> 1), (paintSize >> 1)-1, (paintSize >> 1)-1, 13)
                    }
                }
            }
            // draw the sprite
            this.tileMap.drawImage(this.image, 134, 12)
        }
    }

}