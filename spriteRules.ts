namespace tileworld {

    const yoff = 6;

    export class RuleRoom extends RuleVisualsBase {
        constructor(m: ImageManager) {
            super(m);
            this.showRuleMenu(1, 0);
        }

        centerImage() {
            return this.manager.getImage(3);

            // return this.manager.getImage(getKinds(this.rule)[0]);
        }

        private makeContext(col: number, row: number) {
            let spaceImg = this.manager.empty();
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    //let dist = Math.abs(j) + Math.abs(i);
                    //if (dist <= 1) {
                        // TODO: limit the context base on the rule type
                        this.drawImage(col+i, row+j, spaceImg);
                    //}
                }
            }
        }

        private setRuleType(rt: RuleType, rd: MoveDirection, col: number, row: number) {
            this.ruleTypeMap.setPixel(col, row, rt);
            this.dirMap.setPixel(col, row, rd);
        }

        private doBoth(rt: RuleType, rd: MoveDirection, col: number, row: number, center: boolean = true) {
            if (rt == RuleType.Colliding) {
                this.setRuleType(rt, rd, col + moveXdelta(rd), row + moveYdelta(rd));
            } else if (rt == RuleType.Pushing) {
                this.setRuleType(rt, rd, col - moveXdelta(rd), row - moveYdelta(rd));
            } else {
                this.setRuleType(rt, rd, col, row);
            }
            this.showRuleType(rt, rd, col, row, center);
        }

        private showRuleMenu(x: number, y: number) {
            this.makeContext(x + 2, y + 1)
            this.doBoth(RuleType.Resting, 0, x + 2, y + 1);

            this.makeContext(x + 6, y + 1)
            this.doBoth(RuleType.Moving, MoveDirection.Right, x + 7, y + 1);
            this.doBoth(RuleType.Moving, MoveDirection.Left, x + 5, y + 1);
            this.doBoth(RuleType.Moving, MoveDirection.Up, x + 6, y);
            this.doBoth(RuleType.Moving, MoveDirection.Down, x+6, y+2);

            this.makeContext(x + 2, y + 5);
            this.doBoth(RuleType.Colliding, MoveDirection.Right, x + 2, y + 5, false);
            this.doBoth(RuleType.Colliding, MoveDirection.Left, x + 2, y + 5, false);
            this.doBoth(RuleType.Colliding, MoveDirection.Up, x + 2, y + 5, false);
            this.doBoth(RuleType.Colliding, MoveDirection.Down, x + 2, y + 5, false);
            this.showRuleType(RuleType.Resting, 0, x + 2, y + 5);

            this.makeContext(x + 6, y + 5)
            this.doBoth(RuleType.Pushing, MoveDirection.Right, x + 8, y + 5, false);
            this.doBoth(RuleType.Pushing, MoveDirection.Left, x + 4, y + 5, false);
            this.doBoth(RuleType.Pushing, MoveDirection.Down, x + 6, y + 7, false);
            this.doBoth(RuleType.Pushing, MoveDirection.Up, x + 6, y + 3, false);
        }
    }
}