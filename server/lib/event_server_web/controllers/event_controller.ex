defmodule EventServerWeb.EventController do
  use EventServerWeb, :controller

  alias EventServer.Events
  alias EventServer.Events.Event
  alias EventServer.Users
  alias EventServer.Invites
  alias EventServer.Invites.Invite

  action_fallback EventServerWeb.FallbackController

  plug :fetch_event when action in [:show, :update, :delete]
  plug :require_login when action in [:show, :update, :delete]
  plug :require_owner when action in [:update, :delete]
  plug :require_owner_or_invited when action in [:show]

  # Assign the current event to the connection
  def fetch_event(conn, _args) do
    event = Events.get_event! conn.params["id"]
    assign conn, :event, event
  end

  # Do not allow any event-specific requests to non-logged in users
  def require_login(conn, _args) do
    if logged_in?(conn) do
      conn
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{info: "Please log in above or sign up below to view that event"})
      )
    end
  end

  # Only the owner can edit events
  def require_owner(conn, _args) do
    if owner?(conn) do
      conn
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "You do not own that event"})
      )
    end
  end

  # Only the owner or invitees can view the event
  def require_owner_or_invited(conn, _args) do
    if owner?(conn) or invited?(conn) do
      conn
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "You are not invited to that event"})
      )
    end
  end

  def index(conn, _params) do
    events = if logged_in?(conn), do: Events.events_for(conn.assigns[:current_user]), else: []
    render(conn, "index.json", events: events)
  end

  def create(conn, %{"event" => event_params}) do
    event_params = Map.merge(event_params, %{ "user_id" => conn.assigns[:current_user].id })
    with {:ok, %Event{} = event} <- Events.create_event(event_params) do
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{info: "Event created successfully."})
      )
    end
  end

  def show(conn, %{"id" => id}) do
    event = conn.assigns[:event]
    invite = Invites.get_by_event_id_and_email(event.id, conn.assigns[:current_user].email)

    invites = if owner?(conn) do
      invited_emails = Enum.map(event.invites, fn x -> x.email end)
      invited_users_by_email = Users.get_users_by_emails(invited_emails)
      |> Enum.map(fn x -> {x.email, x.name} end)
      |> Map.new

      for response <- Ecto.Enum.values(Invite, :response) ++ [nil], into: %{} do
        {response, Enum.map(Enum.filter(event.invites, fn x -> x.response == response end), fn y -> invited_users_by_email[y.email] || y.email end)}
      end
    else
      nil
    end

    render(conn, "show.json", event: event, invite: invite, invites: invites)
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)

    with {:ok, %Event{} = event} <- Events.update_event(event, event_params) do
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{info: "Event updated successfully."})
      )
    end
  end

  def delete(conn, %{"id" => id}) do
    event = Events.get_event!(id)

    with {:ok, %Event{}} <- Events.delete_event(event) do
      send_resp(conn, :no_content, "")
    end
  end

  defp owner?(conn) do
    conn.assigns[:current_user].id == conn.assigns[:event].user_id
  end

  defp invited?(conn) do
    conn.assigns[:event].invites
    |> Enum.any? fn x -> x.email == conn.assigns[:current_user].email end
  end
end
