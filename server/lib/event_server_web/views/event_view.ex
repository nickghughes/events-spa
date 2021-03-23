defmodule EventServerWeb.EventView do
  use EventServerWeb, :view
  alias EventServerWeb.EventView

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("event.json", %{event: event}) do
    %{id: event.id,
      title: event.title,
      date: event.date,
      description: event.description}
  end
end
