import { useState } from 'react';
import { Mail, User, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ContactMessage } from '../../types';

const sampleMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Collaboration Inquiry',
    message: 'Hi Gabriel, I came across your portfolio and am impressed by your work in health informatics. I would love to discuss a potential collaboration on a healthcare data project.',
    read: false,
    created_at: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@company.com',
    subject: 'Job Opportunity',
    message: 'Hello Gabriel, We are looking for a Data Analyst with experience in healthcare. Would you be interested in learning more about this opportunity?',
    read: true,
    created_at: '2024-01-18T14:15:00Z',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@healthtech.org',
    subject: 'Speaking Opportunity',
    message: 'Hi Gabriel, We are organizing a Digital Health conference in March and would like to invite you as a speaker. Please let me know if you are interested.',
    read: false,
    created_at: '2024-01-15T09:00:00Z',
  },
];

const MessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(sampleMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
    toast.success('Marked as read');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success('Message deleted');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <p className="text-white/60">
            You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
          {messages.map((message) => (
            <button
              key={message.id}
              onClick={() => {
                setSelectedMessage(message);
                if (!message.read) handleMarkAsRead(message.id);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selectedMessage?.id === message.id
                  ? 'bg-electric/10 border-electric/50'
                  : 'bg-charcoal-light border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-electric/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-electric" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${message.read ? 'text-white/70' : 'text-white'}`}>
                      {message.name}
                    </p>
                    <p className="text-xs text-white/40">{message.email}</p>
                  </div>
                </div>
                {!message.read && <span className="w-2 h-2 bg-electric rounded-full" />}
              </div>
              <p className="text-sm text-white/60 line-clamp-1 mb-1">{message.subject}</p>
              <p className="text-xs text-white/40 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(message.created_at)}
              </p>
            </button>
          ))}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-charcoal-light border border-white/5 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedMessage.name}
                    </span>
                    <span>{selectedMessage.email}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="px-4 py-2 bg-electric hover:bg-electric-dark text-white text-sm rounded-lg transition-colors"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-white/40 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-white/40 mb-4">
                Received: {formatDate(selectedMessage.created_at)}
              </div>

              <div className="bg-white/[0.02] rounded-lg p-6">
                <p className="text-white/80 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-charcoal-light border border-white/5 rounded-xl p-12">
              <Mail className="h-12 w-12 text-white/20 mb-4" />
              <p className="text-white/40">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesManager;
