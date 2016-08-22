var App = {
  templates: {},
  init: function() {
    this.Items = new ItemCollection(items_json);
    this.render();
    this.bind();
  },
  bind: function() {
    $("th").on("click", function(e) {
      this.Items.comparator = $(e.target).attr("data-prop");
      this.render();
    }.bind(this) );

    $("form").on("submit", function(e) {
      e.preventDefault();

      var itemProps = $(this).serializeArray(),
          item = {};

      itemProps.forEach(function(prop) {
        item[prop.name] = prop.value;
      });

      App.Items.add(item);

      App.render();
    });

    $("table").on("click", "td a", function(e) {
      e.preventDefault();

      var id = +$(e.target).attr("data-id");

      App.Items.remove(id);

      App.render();
    });

    $("p a").on("click", function(e) {
      e.preventDefault();

      this.Items.reset();
      this.render();
    }.bind(this) );
  },
  render: function() {
    this.Items.sort();
    $("tbody").html(this.templates.items({ items: this.Items.models }));
  },
};

$("[type='text/x-handlebars']").each(function() {
  $template = $(this);
  App.templates[$template.attr("id")] = Handlebars.compile($template.html());
});

Handlebars.registerPartial("item", $("[id='item']").html());

var ItemModel = Backbone.Model.extend({
      initialize: function() {
        this.collection.incrementId();
        this.set("id", this.collection.last_id);
      }
    }),
    ItemCollection = Backbone.Collection.extend({
      initialize: function() {
      },
      model: ItemModel,
      comparator: "name",
      last_id: 0,
      incrementId: function() {
        this.last_id++
      }
    });

App.init();









