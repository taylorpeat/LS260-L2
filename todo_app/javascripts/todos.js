var App = {
  init: function() {
    this.bind();
    this.Todos = new TodoCollection();
  },
  bind: function() {
    $("form").on("submit", function(e) {
      e.preventDefault();

      var new_todo = this.newTodo(e);
      this.Todos.add(new_todo);
      e.target.reset();
    }.bind(this) );

    $("#clear").on("click", this.clearComplete.bind(this)); 
  },
  newTodo: function(e) {
    var todo_name = $(e.target).find("input").val(),
        model,
        props;

    if (!todo_name) { return; }

    props = {
      name: todo_name,
      complete: false
    };

    model = new TodoModel(props);
    new TodoView({ model: model });
    return model;
  },
  clearComplete: function(e) {
    var completed = this.Todos.where({ complete: true });
    completed.forEach(function(td) {
      App.Todos.remove(td.id);
    });
  }
};

var templates = {};

$( "[type='text/x-handlebars']" ).each(function( template ) {
  var $t = $(this);
  templates[$t.attr("id")] = Handlebars.compile($t.html());
});


var TodoModel = Backbone.Model.extend({
  initialize: function() {
    this.collection = App.Todos;
    this.set("id", this.collection.getNextId());
  }
});

var TodoCollection = Backbone.Collection.extend({
    nextId: 0,
    getNextId: function() {
      this.nextId++;
      return this.nextId;
    },
    model: TodoModel,
  });


var TodoView = Backbone.View.extend({
  tagName: "li",
  template: templates.todo,
  edit_template: templates.todo_edit,
  events: {
    "click": "renderEdit",
    "click a.toggle": "toggleComplete",
  },
  renderEdit: function(e) {
    e.preventDefault();
    
    this.$el.html(this.edit_template(this.model.toJSON()));
    this.$el.find("input")[0].focus();
    this.undelegateEvents();
    this.delegateEvents({ "blur input": "updateModel" });
  },
  updateModel: function(e) {
    console.log("update");
    this.model.set("name", e.target.value);
    this.rerenderTodo();
  },
  toggleComplete: function(e) {
    this.model.set("complete", !this.model.get("complete"));
    return false;
  },
  toggleCheckbox: function() {
    this.$el.toggleClass("complete");
  },
  rerenderTodo: function(e) {
    console.log(this.model.toJSON());
    this.$el.html(this.template(this.model.toJSON()));
    this.delegateEvents();
  },
  renderNew: function() {
    this.$el.attr("data-id", this.model.toJSON().id);
    $("ul").prepend(this.$el.html(this.template( this.model.toJSON())));
  },
  remove: function() {
    this.$el.remove();
  },
  initialize: function() {
    this.renderNew();
    this.listenTo(this.model, "remove", this.remove);
    this.listenTo(this.model, "change:complete", this.toggleCheckbox);
  }
});

App.init();



