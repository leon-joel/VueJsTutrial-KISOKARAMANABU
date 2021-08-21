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
  computed: {
    // 絞り込み結果を返す算出プロパティ
    // ※算出プロパティは結果がキャッシュされるので、todosに変更がない限り再計算されない
    computedTodos: function () {
      return this.todos.filter(function (todoItem) {
        return this.current < 0 ? true : this.current === todoItem.state
      }, this)
    },

    // キーからラベルを簡単に引けるように対照表を作成
    //   {0: '作業中', 1: '完了', -1: 'すべて'}
    // ※算出メソッドの記述がcomputedTodosとちょっと違う（xxx(){} と xxx: function(){}）がどちらでもいいみたい
    //   いずれにしても、アロー関数は使っちゃいけないようだ。
    //   [【Vue.js】methods,computed内部でアロー関数を使ってはいけない](https://www.ultra-noob.com/blog/2020/47/)
    labels() {
      // reduce関数 はRubyの inject と同じ。accum に対して各要素(option)をたたみ込んでいく
      return this.options.reduce(function (accum, option) {
        // assign関数は第1引数(accum)に対して、第2引数をマージする
        return Object.assign(accum, { [option.value]: option.label })
      }, {})
    },
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
    },
    // 対照表を作らずに都度都度Lookupする関数
    lookupStatusLabel: function (status) {
      var opt = this.options.find(function (option) {
        return option.value === status
      }, this);
      // ※findで見つからなかったら戻り値 opt は undefined になる
      return opt.label;
    }
  },
});