// ローカルストレージ API の使用
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// Vueインスタンス
const app = new Vue({
  el: '#app',
  data: {
    todos: [],
  },
  watch: {
    todos: {
      handler: function (todos) {
        // todos引数には変更後の値が入っている
        todoStorage.save(todos)
      },
      // ネストしたデータも監視する
      deep: true,
    }
  }
  methods: {
    doAdd: function (event, value) {
      // ref で名前を付けておいたDOM要素を参照
      var comment = this.$refs.comment
      if (!comment.value.length){
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0, // 作業中
      })
      // フォーム要素を空にする
      comment.value = ''
    }
  },
});