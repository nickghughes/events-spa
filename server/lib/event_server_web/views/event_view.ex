defmodule EventServerWeb.EventView do
  use EventServerWeb, :view
  alias EventServerWeb.EventView
  alias EventServerWeb.UserView
  alias EventServerWeb.CommentView
  alias EventServerWeb.InviteView

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event, invites: invites, invite: invite}) do
    invite_json = if invite, do: render_one(invite, InviteView, "invite.json"), else: nil
    %{data: Map.merge(%{invites: invites, invite: invite_json}, render_one(event, EventView, "event.json"))}
  end

  def render("event.json", %{event: event}) do
    user = if Ecto.assoc_loaded?(event.user) do
      render_one(event.user, UserView, "user.json")
    else
      nil
    end

    comments = if Ecto.assoc_loaded?(event.comments) do
      render_many(event.comments, CommentView, "comment.json")  
    else
      nil
    end

    %{
      id: event.id,
      title: event.title,
      date: NaiveDateTime.to_iso8601(event.date),
      date_display: EventServer.Events.Event.date_display(event),
      description: event.description,
      user: user,
      comments: comments
    }
  end
end
