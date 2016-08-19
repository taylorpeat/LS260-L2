var PostModel = Backbone.Model.extend({
  urlRoot: "http://jsonplaceholder.typicode.com/posts",
  setUser: function() {
    var post_user = new UserModel({ id: this.get("userId") });

    post_user.fetch({
      success: function(user) {
        this.set("user", user);
        console.log(this.toJSON());
      }.bind(this)
    });
  },
  initialize: function() {
    this.has("userId") && this.setUser();
    this.on( "change:userId", this.setUser );
    this.on( "change", renderPost );
  }
});

var UserModel = Backbone.Model.extend({
  urlRoot: "http://jsonplaceholder.typicode.com/users"
});

var post = new PostModel({ id: 1 });

post.fetch();

var new_post = new PostModel({
  id: 2,
  title: "New Title",
  body: "This post has a nice body",
  userId: 2
});

var post_html = $("#post").html();

function renderPost(model) {
  var $post = $(post_html);

  $post.find("h1").text(model.get("title"));
  $post.find("header p").text("By " + model.get("user").get("name"));
  $post.find("header + p").text(model.get("body"));
  $(document.body).html($post);
}


