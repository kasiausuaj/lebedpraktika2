const storageKey = 'notes-app';
const storageData = localStorage.getItem(storageKey);

const initialData = storageData ? JSON.parse(storageData) : {
    firstColumn: [],
    secondColumn: [],
    thirdColumn: []
};


let app = new Vue({
    el: '#app',
    data: {
        firstColumn: initialData.firstColumn,
        secondColumn: initialData.secondColumn,
        thirdColumn: initialData.thirdColumn,
        groupName: null,
        inputOne: null,
        inputTwo: null,
        inputThr: null,
        inputFor: null,
    },
    watch: {
        firstColumn: {
            handler(newFirstColumn) {
                this.saveData();
            },
            deep: true
        },
        secondColumn: {
            handler(newSecondColumn) {
                this.saveData();
            },
            deep: true
        },
        thirdColumn: {
            handler(newThirdColumn) {
                this.saveData();
            },
            deep: true
        }
    },
    methods: {
        saveData() {
            const data = {
                firstColumn: this.firstColumn,
                secondColumn: this.secondColumn,
                thirdColumn: this.thirdColumn
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
        },
        deleteGroup(groupId) {
            const index = this.thirdColumn.findIndex(group => group.id === groupId);
            if (index !== -1) {
                this.thirdColumn.splice(index, 1);
            }
        },
        updateProgress(card) {
            const checkedCount = card.items.filter(item => item.checked).length;
            const progress = (checkedCount / card.items.length) * 100;
            card.isComplete = progress === 100;
            if (card.isComplete) {
                card.lastChecked = new Date().toLocaleString();
            }
            this.checkMoveCard();
        },
        MoveFirstColm() {
            this.firstColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;

                const isMaxSecondColumn = this.secondColumn.length >= 5;

                if (progress >= 50 && !isMaxSecondColumn) {
                    this.secondColumn.push(card);
                    this.firstColumn.splice(this.firstColumn.indexOf(card), 1);
                    this.MoveSecondColm();
                }
                else {
                }
            });

        },
        MoveSecondColm() {
            this.secondColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
                if (progress === 100) {
                    card.isComplete = true;
                    card.lastChecked = new Date().toLocaleString();
                    this.thirdColumn.push(card);
                    this.secondColumn.splice(this.secondColumn.indexOf(card), 1);
                    this.MoveFirstColm();
                }
            })
        },
        checkMoveCard() {
            this.MoveFirstColm();
            this.MoveSecondColm();
        },
        addCard() {
            const newGroup = {
                id: Date.now(),
                groupName: this.groupName,
                items: [
                    { text: this.inputOne, checked: false },
                    { text: this.inputTwo, checked: false },
                    { text: this.inputThr, checked: false },
                    { text: this.inputFor, checked: false },
                ]
            }
            console.log(this.firstColumn.length < 3)
            if (this.firstColumn.length < 3) {
                this.firstColumn.push(newGroup)
            }
            this.groupName = null,
                this.inputOne = null,
                this.inputTwo = null,
                this.inputThr = null,
                this.inputFor = null
        }
    }
})