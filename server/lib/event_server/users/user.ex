defmodule EventServer.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string

    has_many :events, EventServer.Events.Event
    has_many :comments, EventServer.Comments.Comment

    timestamps()
  end

  # Credit lecture notes for password hashing:
  # https://github.com/NatTuck/scratch-2021-01/blob/19057127559577ba3a0bb50b5f72d12c43194b73/4550/0323/photo-blog-spa/server/lib/photo_blog/users/user.ex

  @doc false
  def changeset(user, attrs) do
  IO.inspect attrs
    user
    |> cast(attrs, [:name, :email])
    |> add_password_hash(attrs["password"])
    |> validate_required([:name, :email, :password_hash])
  end

  def add_password_hash(cset, nil), do: cset

  def add_password_hash(cset, password) do
    change(cset, Argon2.add_hash(password))
  end
end
