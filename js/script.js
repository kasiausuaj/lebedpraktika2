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
        noteTitle: null,
        actionOne: null,
        actionTwo: null,
        actionThree: null,
        actionFour: null,
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
        deleteNoteGroup(groupId) {
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
        moveFirstColumn() {
            this.firstColumn.forEach(note => {
                const progress = (note.items.filter(item => item.checked).length / note.items.length) * 100;

                const isMaxSecondColumn = this.secondColumn.length >= 5;

                if (progress >= 50 && !isMaxSecondColumn) {
                    this.secondColumn.push(note);
                    this.firstColumn.splice(this.firstColumn.indexOf(note), 1);
                    this.moveSecondColumn();
                }
            });

        },
        moveSecondColumn() {
            this.secondColumn.forEach(note => {
                const progress = (note.items.filter(item => item.checked).length / note.items.length) * 100;
                if (progress === 100) {
                    note.isComplete = true;
                    note.lastChecked = new Date().toLocaleString();
                    this.thirdColumn.push(note);
                    this.secondColumn.splice(this.secondColumn.indexOf(note), 1);
                    this.moveFirstColumn();
                }
            })
        },
        checkMoveCard() {
            this.moveFirstColumn();
            this.moveSecondColumn();
        },
        addNote() {
            const newNoteGroup = {
                id: Date.now(),
                noteTitle: this.noteTitle,
                items: [
                    { text: this.actionOne, checked: false },
                    { text: this.actionTwo, checked: false },
                    { text: this.actionThree, checked: false },
                    { text: this.actionFour, checked: false },
                ]
            };

            if (this.firstColumn.length < 3) {
                this.firstColumn.push(newNoteGroup);
            }

            this.noteTitle = null;
            this.actionOne = null;
            this.actionTwo = null;
            this.actionThree = null;
            this.actionFour = null;
        }
    },
});