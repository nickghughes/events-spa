defmodule EventServerWeb.UserController do
  use EventServerWeb, :controller

  alias EventServer.Users
  alias EventServer.Users.User

  action_fallback EventServerWeb.FallbackController

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Users.create_user(user_params) do
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{
          session: %{ user_id: user.id, name: user.name, token: Phoenix.Token.sign(conn, "user_id", user.id)},
          success: "Registered Successfully. Welcome, #{user.name}!"
        })
      )
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
