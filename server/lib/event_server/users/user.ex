defmodule EventServer.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string

    has_many :events, EventServer.Events.Event
    has_many :comments, EventServer.Comments.Comment

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :profile_photo_hash])
    |> validate_required([:name, :email])
  end
end
