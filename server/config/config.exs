# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :event_server,
  ecto_repos: [EventServer.Repo]

# Configures the endpoint
config :event_server, EventServerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "ICai34ITvZLkj7HHljgXAaFZvEAaktqc7s3Py2Wz3VdjLlpSQ5DnEy5fSiSItSG5",
  render_errors: [view: EventServerWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: EventServer.PubSub,
  live_view: [signing_salt: "peiUaBB3"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
