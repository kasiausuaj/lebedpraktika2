new Vue({
  el: '#app',
  data: {
    noteTitle: '',
    items: [],
    firstColumn: [],
    secondColumn: [],
    thirdColumn: [],
    isFirstColumnLocked: false
  },
  mounted() {
      if (localStorage.getItem('noteData')) {
        const noteData = JSON.parse(localStorage.getItem('noteData'));
        this.firstColumn = noteData.firstColumn;
        this.secondColumn = noteData.secondColumn;
        this.thirdColumn = noteData.thirdColumn;
      }
    },
    computed: {
      isDisabled() {
          return function (groupIndex, item) {

              return item.checked || this.isGroupLastItemDisabled[groupIndex] === item;
          };
      },
      isGroupLastItemDisabled() {
          return this.firstColumn.map(group => {
              if (this.secondColumn.length >= 5 && group.items.length > 0) {
                  console.log(group.items)
                  const lastUncheckedItem = group.items.slice().reverse().find(item => !item.checked);
                  return lastUncheckedItem;
              }

              return null;
          });
      },
  },
  methods: {
    deleteNoteGroup(groupId) {
      this.firstColumn = this.firstColumn.filter(group => group.id !== groupId);
      this.secondColumn = this.secondColumn.filter(group => group.id !== groupId);
      this.thirdColumn = this.thirdColumn.filter(group => group.id !== groupId);
      this.saveDataToLocalStorage();
    },
    updateProgress(card) {
      const checkedCount = card.items.filter(item => item.checked).length;
      const progress = (checkedCount / card.items.length) * 100;
      card.isComplete = progress === 100;
      if (card.isComplete) {
          card.lastChecked = new Date().toLocaleString();
      }
      this.checkMoveCard();
      this.saveDataToLocalStorage();
  },
    moveFirstColumn() {
      this.firstColumn.forEach(note => {
        const progress = (note.items.filter(item => item.checked).length / note.items.length) * 100;

        const isMaxSecondColumn = this.secondColumn.length >= 5;
        if(this.secondColumn.length == 5) {
          this.isFirstColumnLocked = true;
        }
      else{
          this.isFirstColumnLocked = false;
      }
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
      });
    },
    checkMoveCard() {
      this.moveFirstColumn();
      this.moveSecondColumn();
    },
    checkDisableFirstColumn() {
      if (this.secondColumn.length >= 5) {
        const areAllSecondColumnComplete = this.secondColumn.every(note => note.isComplete);
        this.firstColumn.forEach((note, groupIndex) => {
          note.items.forEach(item => {
            if (areAllSecondColumnComplete) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          });
          this.isGroupLastItemDisabled[groupIndex] = note.items[note.items.length - 1];
        });
      }
    },
    addItem() {
      console.log(this.items)
      if (this.items.length < 5 && this.firstColumn.length < 3) {
        if (this.items.some(item => item.text.trim() === '')) {
          // Если есть хотя бы один пустой текст, не добавляем новую запись
          return;
        }
        this.items.push({ id: Date.now(), text: '', checked: false });
      }
    },
    createNotes() {
      if (
        this.noteTitle &&              // Проверка на заполненность заголовка
        this.items.length >= 3 &&     // Проверка на минимальное количество элементов
        this.items.length <= 5 &&    // Проверка на максимальное количество элементов
        !this.items.some(item => !item.text.trim())  // Проверка на пустые элементы
      ) {
        const newNoteGroup = {
          id: Date.now(),
          noteTitle: this.noteTitle,
          items: this.items,
          isComplete: false,
          lastChecked: null
        };
    
        this.firstColumn.push(newNoteGroup);
        this.saveDataToLocalStorage();
    
        this.noteTitle = '';
        this.items = [];
      }
    },


    saveDataToLocalStorage() {
      const noteData = {
        firstColumn: this.firstColumn,
        secondColumn: this.secondColumn,
        thirdColumn: this.thirdColumn
      };
      localStorage.setItem('noteData', JSON.stringify(noteData));
    },
  }
});