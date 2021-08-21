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
    // 絞り込み用の選択肢
    options: [
      { value: -1, label: 'すべて' },
      { value: 0, label: '作業中' },
      { value: 1, label: '完了' },
    ],
    // 選択中オプション
    current: -1,
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
  },
  created() {
    // インスタンス作成時に自動的に fetch() する
    this.todos = todoStorage.fetch()
  },
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
    },
    doChangeState: function (item) {
      item.state = item.state ? 0 : 1
    },
    doRemove: function (item) {
      var index = this.todos.indexOf(item)
      // spliceは削除・置換・挿入など色々出来るJSのメソッド。ここではindex番目から1つの要素を削除している。
      this.todos.splice(index, 1)
    }
  },
});