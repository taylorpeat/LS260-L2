var App = {
  init: function() {
    this.Items = new ItemCollection(items_json);
    this.View = new ItemsView({ collection: this.Items });
    this.View.render();
    this.bind();
  },
  parseForm: function() {
    return {
       name: $("[name='name']").val(),
       quantity: $("[name='quantity']").val()
      };
  },
  bind: function() {
    $("th").on("click", function(e) {
      this.Items.comparator = $(e.target).attr("data-prop");
      this.Items.trigger("sortView");
    }.bind(this) );
          
    $("form").on("submit", function(e) {
      e.preventDefault();
      App.Items.add(this.parseForm());
    }.bind(this) );

    $("p a").on("click", function(e) {
      e.preventDefault();
      this.Items.reset();
    }.bind(this) );
  },

};

Handlebars.registerPartial("item", $("[id='item']").html());

var ItemModel = Backbone.Model.extend({
      initialize: function() {
        this.collection.incrementId();
        this.set("id", this.collection.last_id);
      }
    }),
    ItemCollection = Backbone.Collection.extend({
      model: ItemModel,
      comparator: "name",
      last_id: 0,
      incrementId: function() {
        this.last_id++
      }
    }),
    ItemsView = Backbone.View.extend({
      el: $("tbody"),
      events: {
        "click a": "removeItem"
      },
      template: Handlebars.compile($("#items").html()),
      removeItem: function(e) {
        e.preventDefault();

        console.log("trying to remove");
        var id = $(e.target).attr("data-id");

        this.collection.remove(id);
      },
      initialize: function() {
        this.listenTo(this.collection, "sortView add", this.collection.sort.bind(this.collection));
        this.listenTo(this.collection, "remove reset add sortView", this.render);
      },
      render: function() {
        this.$el.html(this.template({ items: this.collection.toJSON() }));
      }
    });

App.init();









