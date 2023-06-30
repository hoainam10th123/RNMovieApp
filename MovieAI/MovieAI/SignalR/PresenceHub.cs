using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MovieAI.Extensions;

namespace MovieAI.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }
        public override async Task OnConnectedAsync()
        {
            var username = Context.User!.GetUsername();
            await _tracker.UserConnected(username, Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var username = Context.User!.GetUsername();
            await _tracker.UserDisconnected(username, Context.ConnectionId);           
            await base.OnDisconnectedAsync(exception);
        }
    }
}
