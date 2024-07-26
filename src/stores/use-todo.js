import { defineStore } from "pinia";
import { db } from "../firebase/config";
import {collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: null,
    ongoingTodos: null,
    doneTodos: null,
    favTodos: null,
    filteredTodos: null,
    auth: getAuth(),
  }),
  actions: {
    // Load todos from databases
    async loadTodos(sortedRef) {
      onSnapshot(sortedRef, (querySnapshot) => {
        const fbTodos = [];
        const fbOngoings = [];
        const fbDones = [];
        const fbFavTodos = [];
        querySnapshot.forEach((doc) => {
          if ( doc._document.data.value.mapValue.fields.userId.stringValue === this.auth.currentUser.uid ) {
            // Add todos to an array depending on their state
            if (doc.data().etat == 'to do') {
              const todo = {
                id: doc.id,
                content: doc.data().content,
                etat: doc.data().etat,
                favorite: doc.data().favorite
              };
              fbTodos.push(todo);
            }
            if(doc.data().etat == 'done'){
              const doneTodos = {
                id: doc.id,
                content: doc.data().content,
                etat: doc.data().etat,
                favorite: doc.data().favorite
              };
              fbDones.push(doneTodos);
            }
            if(doc.data().etat == 'ongoing'){
              const ongoingTodos = {
                id: doc.id,
                content: doc.data().content,
                etat: doc.data().etat,
                favorite: doc.data().favorite
              };
              fbOngoings.push(ongoingTodos);
            }
            if (doc.data().favorite == true) {
              const favTodos = {
                id: doc.id,
                content: doc.data().content,
                etat: doc.data().etat,
                favorite: doc.data().favorite
              };
              fbFavTodos.push(favTodos);
            }
          }
        });
        this.todos = fbTodos;
        this.doneTodos = fbDones;
        this.ongoingTodos = fbOngoings;
        this.favTodos = fbFavTodos;
      });
    },

    // Add todos to an array depending on filters
    async loadFilteredTodos(sortedRef, priority, state) {
      console.log("state : " + state);
      console.log("priority : " + priority);
    
      onSnapshot(sortedRef, (querySnapshot) => {
        const fbfilteredTodos = [];
        
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          const userId = doc._document.data.value.mapValue.fields.userId.stringValue;
    
          if (userId === this.auth.currentUser.uid) {
            const matchesPriority = priority === "" || docData.priorite == priority;
            const matchesState = state === "" || docData.etat == state;
    
            if (matchesPriority && matchesState) {
              fbfilteredTodos.push({
                id: doc.id,
                content: docData.content,
                etat: docData.etat,
                favorite: docData.favorite
              });
            }
          }
        });
    
        this.filteredTodos = fbfilteredTodos;
      });
    },
    
    
    addTodoList(list, todo) {
      addDoc(collection(db, list), {
        userMail: this.auth.currentUser.email,
        userId: this.auth.currentUser.uid,
        content: todo.content,
        etat: "to do", // Default value : to do. Enum = {'to do', 'ongoing', 'done' }
        debut: todo.start,
        fin: todo.end,
        priorite: todo.priority, // Enum = {'lower', 'medium', 'higher' }
        favorite: false // Default value
      });
    },

    filterItems(todo, priority, state) {
      this.filteredTodos = this.todos.filter(todo => {
        // Filtrer par priorité
        const priorityFilter = priority
        const matchesPriority = priorityFilter === '' || todo.priority === priorityFilter

        // Filtrer par état
        const statusFilter = status
        const matchesStatus = statusFilter === '' || todo.status === statusFilter

        return matchesPriority && matchesStatus
      })
    },
    
    deleteTodoList(list, id) {
      deleteDoc(doc(db, list, id));
    },
    
    setTodoDone(id, ref) {
      updateDoc(doc(ref, id), {
        etat: 'done',
      });
    },

    setTodoOngoing(id, ref) {
      updateDoc(doc(ref, id), {
        etat: 'ongoing',
      });
    },
    
    setTodoUndone(id, ref) {
      updateDoc(doc(ref, id), {
        etat: 'to do',
      });
    },

    addTodoFavorites(id, ref, isFav) {
      updateDoc(doc(ref, id), {
        favorite: !isFav,
      });
    },
    
    editTodo(id, ref, changedContent){
      updateDoc(doc(ref, id), {
        content: changedContent
      });
    },
  },
});
