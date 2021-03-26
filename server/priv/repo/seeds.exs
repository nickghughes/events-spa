# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     EventServer.Repo.insert!(%EventServer.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias EventServer.Repo
alias EventServer.Users.User
alias EventServer.Events.Event
alias EventServer.Invites.Invite
alias EventServer.Comments.Comment

defmodule Inject do
  def user(name, email, pass) do
    hash = Argon2.hash_pwd_salt(pass)
    Repo.insert!(%User{email: email, name: name, password_hash: hash})
  end
end

# Create some users

rod = Inject.user("rod", "rod@test.com", "testrod")
pam = Inject.user("pam", "pam@test.com", "testpam")
bob = Inject.user("bob", "bob@test.com", "testbob")
amy = Inject.user("amy", "amy@test.com", "testamy")

# Create some events with invites and comments

rod_event1 = Repo.insert!(%Event{user_id: rod.id, title: "Rod's Test Event 1", description: "This is a test event 1", date: ~N[2020-03-08 12:00:00]})
Repo.insert!(%Invite{email: pam.email, event_id: rod_event1.id, response: :yes})
Repo.insert!(%Invite{email: bob.email, event_id: rod_event1.id, response: :no})
Repo.insert!(%Invite{email: amy.email, event_id: rod_event1.id, response: :maybe})

pam_event1 = Repo.insert!(%Event{user_id: pam.id, title: "Pam's Test Event 1", description: "", date: ~N[2020-03-16 14:00:00]})
Repo.insert!(%Invite{email: rod.email, event_id: pam_event1.id})
Repo.insert!(%Invite{email: bob.email, event_id: pam_event1.id, response: :no})
Repo.insert!(%Comment{user_id: bob.id, event_id: pam_event1.id, body: "Sorry, I'll make it next time."})
Repo.insert!(%Comment{user_id: pam.id, event_id: pam_event1.id, body: "Sorry to hear that bob"})

rod_event2 = Repo.insert!(%Event{user_id: rod.id, title: "Rod's Test Event 2", description: "This is a test event 2", date: ~N[2020-03-10 09:00:00]})
Repo.insert!(%Invite{email: pam.email, event_id: rod_event2.id, response: :yes})
Repo.insert!(%Invite{email: bob.email, event_id: rod_event2.id, response: :yes})
Repo.insert!(%Invite{email: amy.email, event_id: rod_event2.id})
Repo.insert!(%Comment{user_id: pam.id, event_id: rod_event2.id, body: "Can't wait!"})
Repo.insert!(%Comment{user_id: bob.id, event_id: rod_event2.id, body: "I'm not sure if I can go yet."})
Repo.insert!(%Comment{user_id: bob.id, event_id: rod_event2.id, body: "Just checked my schedule, good to go!"})
Repo.insert!(%Comment{user_id: rod.id, event_id: rod_event2.id, body: "See you guys there!"})

pam_event2 = Repo.insert!(%Event{user_id: pam.id, title: "Pam's Test Event 2", description: "", date: ~N[2020-03-20 20:00:00]})
Repo.insert!(%Invite{email: rod.email, event_id: pam_event2.id, response: :maybe})
Repo.insert!(%Invite{email: bob.email, event_id: pam_event2.id, response: :yes})
Repo.insert!(%Invite{email: amy.email, event_id: pam_event2.id, response: :no})

rod_event3 = Repo.insert!(%Event{user_id: rod.id, title: "Rod's Test Event 3", description: "This is a test event 3", date: ~N[2020-03-18 10:00:00]})
Repo.insert!(%Invite{email: amy.email, event_id: rod_event3.id, response: :maybe})
Repo.insert!(%Comment{user_id: amy.id, event_id: rod_event3.id, body: "I might have a conflict, not sure"})

pam_event3 = Repo.insert!(%Event{user_id: pam.id, title: "Pam's Test Event 3", description: "This is a test event", date: ~N[2020-04-21 18:00:00]})
Repo.insert!(%Invite{email: bob.email, event_id: pam_event3.id})
Repo.insert!(%Invite{email: amy.email, event_id: pam_event3.id, response: :yes})