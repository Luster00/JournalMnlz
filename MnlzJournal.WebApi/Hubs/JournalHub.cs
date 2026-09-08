using Microsoft.AspNetCore.SignalR;
using MnlzJournal.WebApi.Models;

namespace MnlzJournal.WebApi.Hubs;

public class JournalHub : Hub
{
    public async Task RecordAdded(SegmentTestRecord record)
    {
        await Clients.All.SendAsync("ReceiveRecordAdded", record);
    }

    public async Task RecordUpdated(SegmentTestRecord record)
    {
        await Clients.All.SendAsync("ReceiveRecordUpdated", record);
    }

    public async Task RecordDeleted(int id)
    {
        await Clients.All.SendAsync("ReceiveRecordDeleted", id);
    }
}
