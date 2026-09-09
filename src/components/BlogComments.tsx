import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Lock, Heart, CornerDownRight } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
  isSecret?: boolean;
  isAdmin?: boolean;
  replies?: Comment[];
}

interface BlogCommentsProps {
  postSlug: string;
  theme?: 'light' | 'dark';
}

export const BlogComments: React.FC<BlogCommentsProps> = ({ postSlug, theme = 'light' }) => {
  const dark = theme === 'dark';
  const storageKey = `blog_comments_${postSlug}`;

  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out any legacy mock sample comments
        const filtered = Array.isArray(parsed) 
          ? parsed.filter((c: any) => c.id !== 'c1' && c.id !== 'c2' && c.id !== 'c1-1') 
          : [];
        setComments(filtered);
      } else {
        setComments([]);
      }
    } catch {
      setComments([]);
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      alert('작성자 이름과 댓글 내용을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: author.trim(),
      date: formattedDate,
      content: content.trim(),
      isSecret,
    };

    const updated = [...comments, newComment];
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setContent('');
    setPassword('');
    setIsSubmitting(false);
  };

  const totalCommentCount = comments.reduce((acc, cur) => acc + 1 + (cur.replies ? cur.replies.length : 0), 0);

  return (
    <section className={`mt-12 p-5 sm:p-7 rounded-xl border transition-colors ${
      dark ? 'bg-slate-900/70 border-slate-800 text-slate-200' : 'bg-white border-slate-200 shadow-2xs text-slate-800'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-200/80 dark:border-slate-800">
        <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <h3 className={`text-base font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
          댓글 <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">{totalCommentCount}</span>
        </h3>
        <span className="text-xs text-slate-400 ml-auto">
          건전한 댓글 문화를 지향합니다
        </span>
      </div>

      {/* Comment Form (Classic Tistory Style) */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="이름 (닉네임)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={20}
              required
              className={`w-full text-xs px-3 py-2 rounded-lg border outline-none ${
                dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="비밀번호 (수정/삭제용)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full text-xs px-3 py-2 rounded-lg border outline-none ${
                dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        <textarea
          rows={3}
          placeholder="저작권을 준수하고 서로를 존중하는 따뜻한 댓글을 남겨주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className={`w-full text-xs sm:text-sm p-3 rounded-lg border outline-none resize-y leading-relaxed ${
            dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
          }`}
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className="rounded text-purple-600 focus:ring-0 cursor-pointer"
            />
            <Lock className="w-3 h-3" />
            <span>비밀글</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              dark 
                ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>댓글 등록</span>
          </button>
        </div>
      </form>

      {/* Comment List */}
      {comments.length === 0 ? (
        <div className={`py-8 text-center rounded-xl border border-dashed text-xs ${
          dark ? 'border-slate-800 text-slate-500 bg-slate-900/30' : 'border-slate-200 text-slate-400 bg-slate-50/50'
        }`}>
          <p>아직 작성된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
          <div 
            key={comment.id}
            className={`p-4 rounded-lg border text-xs sm:text-sm ${
              dark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${comment.isAdmin ? 'text-purple-600 dark:text-purple-400' : dark ? 'text-white' : 'text-slate-900'}`}>
                  {comment.author}
                </span>
                {comment.isAdmin && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    블로그 주인장
                  </span>
                )}
                {comment.isSecret && (
                  <span className="flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                    <Lock className="w-2.5 h-2.5" /> 비밀댓글
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {comment.date}
              </span>
            </div>

            <p className={`leading-relaxed mt-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
              {comment.content}
            </p>

            {/* Replies */}
            {comment.replies && comment.replies.map((reply) => (
              <div 
                key={reply.id}
                className={`mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 pl-4 border-l-2 border-purple-400`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <CornerDownRight className="w-3 h-3 text-purple-500" />
                    <span className="font-bold text-xs text-purple-600 dark:text-purple-400">
                      {reply.author}
                    </span>
                    {reply.isAdmin && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        답변
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {reply.date}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {reply.content}
                </p>
              </div>
            ))}
          </div>
        ))}
        </div>
      )}
    </section>
  );
};
