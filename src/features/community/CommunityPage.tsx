import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { communityService } from '../../services/api';
import {
  MessageSquare,
  ThumbsUp,
  Pin,
  Sparkles,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Share2,
  Users
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { mockCommunityPosts } from '../../services/mockData';
import { CommunityPost } from '../../types';

export const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useNotifications();

  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);

  // New post fields
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<CommunityPost['category']>('Showcases');
  const [postTags, setPostTags] = useState('React, Architecture');

  const categories = ['All', 'Showcases', 'Questions', 'Study Groups', 'Announcements'];

  const filteredPosts = posts.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  const handleUpvote = async (postId: string) => {
    const newCount = await communityService.toggleUpvote(postId);
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hasUpvoted: !p.hasUpvoted,
          upvotes: p.hasUpvoted ? p.upvotes - 1 : p.upvotes + 1
        };
      }
      return p;
    }));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const tags = postTags.split(',').map(t => t.trim()).filter(Boolean);
    const created = await communityService.createPost(postTitle, postContent, postCategory, tags);
    setPosts(prev => [created, ...prev]);
    toast('Post Published!', 'Your discussion thread is live in the TYC community.', 'system');
    setNewPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Breadcrumb items={[{ label: 'Developer Community' }]} />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
            TYC Developer & Peer Community
          </h1>
          <p className="text-xs sm:text-sm text-tyc-muted max-w-2xl">
            Share architecture breakdowns, organize mock interview study groups, and get code feedback from instructors.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setNewPostModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Create New Thread
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-tyc-border pb-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              activeCategory === c
                ? 'bg-tyc-green text-white shadow-sm'
                : 'bg-white text-tyc-muted hover:text-tyc-text hover:bg-tyc-bg border border-tyc-border'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="p-6 space-y-4 shadow-subtle border-tyc-border">
            {/* Post Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-tyc-border"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-tyc-text">{post.author.name}</span>
                    {post.author.badge && (
                      <Badge variant="green" size="sm">{post.author.badge}</Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-tyc-muted">{post.author.role} &bull; {post.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.pinned && (
                  <span className="flex items-center gap-1 text-[11px] text-tyc-green font-bold bg-tyc-green-soft px-2 py-0.5 rounded">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
                <Badge variant="gray" size="sm">{post.category}</Badge>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-tyc-text leading-snug">{post.title}</h3>
              <p className="text-xs text-tyc-muted leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 bg-tyc-bg border border-tyc-border rounded text-tyc-muted">
                  #{t}
                </span>
              ))}
            </div>

            {/* Comments Thread Preview */}
            {post.comments && post.comments.length > 0 && (
              <div className="bg-tyc-bg p-3.5 rounded-xl border border-tyc-border space-y-3 mt-2">
                <div className="text-[11px] font-bold text-tyc-muted uppercase">Top Instructor Response</div>
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                    <img src={comment.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover mt-0.5 border border-tyc-border" />
                    <div className="space-y-0.5">
                      <strong className="text-tyc-text">{comment.authorName}</strong>
                      <p className="text-tyc-muted text-[11px] leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions: Upvote & Reply */}
            <div className="flex items-center justify-between pt-3 border-t border-tyc-border text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                    post.hasUpvoted
                      ? 'bg-tyc-green-soft text-tyc-green font-bold border-tyc-green/30'
                      : 'bg-white text-tyc-muted hover:text-tyc-text border-tyc-border'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes} Upvotes</span>
                </button>

                <div className="flex items-center gap-1 text-tyc-muted px-2 py-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} Comments</span>
                </div>
              </div>

              <span className="text-[11px] text-tyc-muted">Peer Reviewed Thread</span>
            </div>
          </Card>
        ))}
      </div>

      {/* New Post Thread Modal */}
      <Modal
        isOpen={newPostModalOpen}
        onClose={() => setNewPostModalOpen(false)}
        title="Create New Discussion Thread"
        description="Ask an architecture question or share your finished project."
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-tyc-text mb-1">Thread Title</label>
            <input
              type="text"
              required
              placeholder="e.g. How I architected a high-throughput Redis clone in Python..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full bg-white border border-tyc-border rounded-lg px-3 py-2 text-xs text-tyc-text focus:outline-none focus:border-tyc-green"
            />
          </div>

          <div>
            <label className="block font-medium text-tyc-text mb-1">Category</label>
            <select
              value={postCategory}
              onChange={(e) => setPostCategory(e.target.value as any)}
              className="w-full bg-white border border-tyc-border rounded-lg px-3 py-2 text-xs text-tyc-text focus:outline-none"
            >
              <option value="Showcases">Project Showcase</option>
              <option value="Questions">Technical / Architecture Question</option>
              <option value="Study Groups">Study Group & Mock Interviews</option>
              <option value="General">General Technology Discussion</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-tyc-text mb-1">Content (Markdown supported)</label>
            <textarea
              rows={5}
              required
              placeholder="Describe your design decisions, code snippet, or study group schedule..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full bg-white border border-tyc-border rounded-lg p-3 text-xs text-tyc-text focus:outline-none focus:border-tyc-green"
            />
          </div>

          <div>
            <label className="block font-medium text-tyc-text mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="React, FastAPI, Career, DSA"
              value={postTags}
              onChange={(e) => setPostTags(e.target.value)}
              className="w-full bg-white border border-tyc-border rounded-lg px-3 py-2 text-xs text-tyc-text focus:outline-none focus:border-tyc-green"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-tyc-border">
            <Button variant="outline" size="sm" onClick={() => setNewPostModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Thread
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
