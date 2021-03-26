# Credit lecture notes at https://github.com/NatTuck/scratch-2021-01/blob/19057127559577ba3a0bb50b5f72d12c43194b73/4550/0323/photo-blog-spa/server/lib/photo_blog_web/controllers/session_controller.ex
defmodule EventServerWeb.SessionController do
  use EventServerWeb, :controller

  def create(conn, %{"email" => email, "password" => password}) do
    user = EventServer.Users.authenticate(email, password)
    if user do
      sess = %{
        user_id: user.id,
        name: user.name,
        token: Phoenix.Token.sign(conn, "user_id", user.id)
      }
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{session: sess, info: "Welcome back, #{user.name}!"})
      )
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "Invalid email or password"})
      )
    end
  end
end