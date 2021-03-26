# Credit lecture notes for session fetch from header:
# https://github.com/NatTuck/scratch-2021-01/blob/19057127559577ba3a0bb50b5f72d12c43194b73/4550/0323/photo-blog-spa/server/lib/photo_blog_web/plugs/require_auth.ex
defmodule EventServerWeb.Plugs.FetchSession do
  import Plug.Conn

  def init(args), do: args

  def call(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    IO.inspect token
    user = case Phoenix.Token.verify(conn, "user_id", token, max_age: 86400) do
      {:ok, user_id} ->
        EventServer.Users.get_user(user_id)
      {:error, err} ->
        nil
    end
    assign(conn, :current_user, user)
  end
end