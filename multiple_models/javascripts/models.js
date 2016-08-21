var ItemModel,
    items = [],
    templates = {},
    criteria = "name";

$("[type='text/x-handlebars']").each(function() {
  $template = $(this);
  templates[$template.attr("id")] = Handlebars.compile($template.html());
});

Handlebars.registerPartial("item", $("[id='item']").html());

ItemModel = Backbone.Model.extend({
  initialize: function() {
    this.set("id", items.length + 1);
    items.push(this);
    render();
  }
});

items_json.forEach(function(item) {
  new ItemModel(item);
});

render();

$("[data-prop='name']").on("click", function() {
  criteria = "name";
  render();
});

$("th").on("click", function() {
  criteria = $(this).attr("data-prop");
  render();
});

$("form").on("submit", function(e) {
  e.preventDefault();

  var itemProps = $(this).serializeArray(),
      item = new ItemModel();

  itemProps.forEach(function(prop) {
    item.set(prop.name, prop.value);
  });

  render();
});

$("table").on("click", "td a", function(e) {
  e.preventDefault();

  var id = +$(e.target).attr("data-id");

  items = items.filter(function(item) {
    return id !== item.toJSON().id;
  });

  render();
});

$("p a").on("click", function(e) {
  e.preventDefault();

  items = [];
  render();
});


function render() {
  sortItems();
  $("tbody").html(templates.items({ items: items }));
}

function sortItems() {
  items = _.sortBy(items, function(item) {
    return item.toJSON()[criteria]
  });
}