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
  Share2,
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
    await communityService.toggleUpvote(postId);
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
        <div className="space-y-2">
          <Breadcrumb items={[{ label: 'Developer Community' }]} />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-800 dark:text-amber-300 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Peer Discussions & Study Groups</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#11184A] dark:text-white tracking-tight">
              TYC Developer & <span className="text-rainbow">Peer Community</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5F6680] dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed font-normal">
              Share architecture breakdowns, organize mock interview study groups, and get code feedback from instructors.
            </p>
          </div>
        </div>

        <Button variant="primary" size="md" onClick={() => setNewPostModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Create New Thread
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800 pb-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeCategory === c
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-[#0D121F] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} hoverable className="p-6 space-y-4 shadow-sm dark:shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{post.author.name}</span>
                    <Badge variant={post.author.role === 'Instructor' ? 'purple' : 'green'} size="sm">
                      {post.author.role}
                    </Badge>
                    <span className="text-[11px] text-slate-400">&bull;</span>
                    <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                    {post.pinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        <Pin className="w-3 h-3 fill-current" /> Pinned
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {post.title}
                  </h3>
                </div>
              </div>

              <Badge variant="gray" size="sm">{post.category}</Badge>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    post.hasUpvoted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-[#161F30] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'fill-current' : ''}`} />
                  <span>{post.upvotes}</span>
                </button>

                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} replies</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Post Modal */}
      {newPostModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setNewPostModalOpen(false)}
          title="Create Discussion Thread"
          size="md"
        >
          <form onSubmit={handleCreatePost} className="space-y-4 p-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category:</label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Showcases">Project Showcase</option>
                <option value="Questions">Technical Question</option>
                <option value="Study Groups">Study Group</option>
                <option value="Announcements">Announcement</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Discussion Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. My Distributed Cache Project Benchmark Results"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Content / Question Details:</label>
              <textarea
                rows={4}
                required
                placeholder="Explain the problem or showcase architecture details..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tags (comma-separated):</label>
              <input
                type="text"
                placeholder="React, TypeScript, Docker, Redis"
                value={postTags}
                onChange={(e) => setPostTags(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setNewPostModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Publish Thread
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
