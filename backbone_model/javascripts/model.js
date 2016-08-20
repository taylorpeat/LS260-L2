var ProductModel = Backbone.Model.extend({
  initialize: function() {
    $.when(this.set("date", new Date())).done(function() {
      this.set("datetime", formatDatetime(this.get("date")));
      this.set("date_formatted", formatDate(this.get("date")));
    }.bind(this) );
    this.bind();
  },
  bind: function() {
    this.on("change:date", function() {
      this.set("datetime", formatDatetime(this.get("date")));
      this.set("date_formatted", formatDate(this.get("date")));
    });
  },
  render: function() {
    $("article").html(templates.product(product_1.toJSON()));
  }
});

$("form").on("submit", function(e){
  e.preventDefault();

  var inputs = $(this).serializeArray();

  inputs.forEach(function(input) {
    product_1.set(input.name, input.value);
  });

  product_1.set("date", new Date());

  product_1.render();
});

var templates = {};

$("[type='text/x-handlebars']").each(function() {
  $template = $(this);
  templates[$template.attr("id")] = Handlebars.compile($template.html());
});

var product_1 = new ProductModel(product_json);

$("article").html(templates.product(product_1.toJSON()));
$("fieldset").html(templates.form(product_1.toJSON()));


function formatDatetime(date) {
  var datetime = date.getFullYear() + "-" + addZero(date.getMonth() + 1)
  datetime += "-" + addZero(date.getDate())
  datetime += "T" + addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
  return datetime;
}

function formatDate(date) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      suffix = dateSuffix(date),
      formatted_date;

  formatted_date = months[date.getMonth()] + " " + date.getDate() + suffix;
  formatted_date += ", " + date.getFullYear() + " " + addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
  return formatted_date;
}

function addZero(number) {
  var fixed_num = number < 10 ? "0" : "";
  return fixed_num += number;
}

function dateSuffix(date) {
  var suffix = "th",
      suffixes = ["st", "nd", "rd"];

  if (date.getDate() <= suffixes.length ||
      date.getDate() > 20 && date.getDate() < 24) {
    suffix = suffixes[date.getDate() % 10 - 1]
  }

  return suffix;
}
