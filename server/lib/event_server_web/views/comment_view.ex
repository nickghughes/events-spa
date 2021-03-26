defmodule EventServerWeb.CommentView do
  use EventServerWeb, :view
  alias EventServerWeb.CommentView
  alias EventServerWeb.UserView

  def render("index.json", %{comments: comments}) do
    %{data: render_many(comments, CommentView, "comment.json")}
  end

  def render("show.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "comment.json")}
  end

  def render("comment.json", %{comment: comment}) do
    user = if Ecto.assoc_loaded?(comment.user) do
      render_one(comment.user, UserView, "user.json")
    else
      nil
    end

    %{
      id: comment.id,
      body: comment.body,
      date: EventServer.Comments.Comment.date_display(comment),
      user: user
    }
  end
end
