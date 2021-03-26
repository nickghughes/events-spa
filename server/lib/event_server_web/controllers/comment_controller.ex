defmodule EventServerWeb.CommentController do
  use EventServerWeb, :controller

  alias EventServer.Comments
  alias EventServer.Comments.Comment
  alias EventServer.Events

  alias EventServerWeb.CommentView

  action_fallback EventServerWeb.FallbackController

  plug :fetch_comment when action in [:delete]
  plug :require_event_owner_or_invitee when action in [:create]
  plug :require_comment_or_event_owner when action in [:delete]

  # Assign the current comment to the connection
  def fetch_comment(conn, _args) do
    comment = Comments.get_comment! conn.params["id"]
    assign conn, :comment, comment
  end

  # Redirect back to events index if user isn't the owner or an invitee
  def require_event_owner_or_invitee(conn, _args) do
    event = Events.get_event! conn.assigns[:comment]["event_id"]
    if logged_in?(conn) and (conn.assigns[:current_user].id == event.user_id or conn.assigns[:current_user].email in Enum.map(event.invites, fn x -> x.email end)) do
      conn
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "You do not have permission for that"})
      )
    end
  end

  # Redirect user back to events index if user tries to delete a comment that isn't theirs
  def require_comment_or_event_owner(conn, _args) do
    if comment_or_event_owner?(conn) do
      conn
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "You do not have permission for that"})
      )
    end
  end

  def index(conn, _params) do
    comments = Comments.list_comments()
    render(conn, "index.json", comments: comments)
  end

  def create(conn, %{"comment" => comment_params}) do
    comment_params = Map.merge(comment_params, %{ "user_id" => conn.assigns[:current_user].id })
    with {:ok, %Comment{} = comment} <- Comments.create_comment(comment_params) do
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{info: "Comment created successfully.", comment: CommentView.render("comment.json", comment: comment)})
      )
    end
  end

  def show(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)
    render(conn, "show.json", comment: comment)
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Comments.get_comment!(id)

    with {:ok, %Comment{} = comment} <- Comments.update_comment(comment, comment_params) do
      render(conn, "show.json", comment: comment)
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)

    with {:ok, %Comment{}} <- Comments.delete_comment(comment) do
      send_resp(conn, :no_content, "")
    end
  end

  defp comment_or_event_owner?(conn) do
    event = Events.get_event! conn.assigns[:comment].event_id
    logged_in?(conn) and 
      (
        conn.assigns[:comment].user_id == conn.assigns[:current_user].id or
        event.user_id == conn.assigns[:current_user].id
      )
  end
end
