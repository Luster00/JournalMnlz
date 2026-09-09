using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using MnlzJournal.WebApi.Models;
using MnlzJournal.WebApi.Services;
using MnlzJournal.WebApi.Hubs;

namespace MnlzJournal.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JournalController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<JournalHub> _hubContext;

    public JournalController(AppDbContext context, IHubContext<JournalHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SegmentTestRecord>>> GetRecords()
    {
        return await _context.SegmentTestRecords
            .OrderByDescending(r => r.TestDate)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SegmentTestRecord>> GetRecord(int id)
    {
        var record = await _context.SegmentTestRecords.FindAsync(id);
        if (record == null)
        {
            return NotFound();
        }
        return record;
    }

    [HttpPost]
    public async Task<ActionResult<SegmentTestRecord>> CreateRecord(SegmentTestRecord record)
    {
        _context.SegmentTestRecords.Add(record);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("ReceiveRecordAdded", record);

        return CreatedAtAction(nameof(GetRecord), new { id = record.Id }, record);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecord(int id, SegmentTestRecord record)
    {
        if (id != record.Id)
        {
            return BadRequest();
        }

        _context.Entry(record).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await RecordExists(id))
            {
                return NotFound();
            }
            throw;
        }

        await _hubContext.Clients.All.SendAsync("ReceiveRecordUpdated", record);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecord(int id)
    {
        var record = await _context.SegmentTestRecords.FindAsync(id);
        if (record == null)
        {
            return NotFound();
        }

        _context.SegmentTestRecords.Remove(record);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("ReceiveRecordDeleted", id);

        return NoContent();
    }

    private async Task<bool> RecordExists(int id)
    {
        return await _context.SegmentTestRecords.AnyAsync(e => e.Id == id);
    }
}
