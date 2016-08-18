var PostModel = Backbone.Model.extend({
  urlRoot: "http://jsonplaceholder.typicode.com/posts"
});

var post = new PostModel({ id: 1 });