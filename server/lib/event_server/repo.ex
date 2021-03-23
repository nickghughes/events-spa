defmodule EventServer.Repo do
  use Ecto.Repo,
    otp_app: :event_server,
    adapter: Ecto.Adapters.Postgres
end
