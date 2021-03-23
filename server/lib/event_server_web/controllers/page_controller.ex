defmodule EventServerWeb.PageController do
  use EventServerWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
