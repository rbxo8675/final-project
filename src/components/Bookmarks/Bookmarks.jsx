import { useState, useRef } from 'react';
import { IoAdd, IoClose, IoCreate, IoLink, IoGlobe } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import styles from './Bookmarks.module.css';

// Get favicon URL for a given URL
const getFaviconUrl = (url) => {
  try {
    const urlObj = new URL(url);
    // Use Google's favicon service
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    return null;
  }
};

const Bookmarks = ({ size = 'medium' }) => {
  const {
    bookmarks,
    language,
    uiSettings,
    widgetStyle,
    addBookmark,
    removeBookmark,
    updateBookmark,
    reorderBookmarks
  } = useSettings();

  const isEditing = uiSettings?.editMode || false;
  const sizeClass = styles[size] || styles.medium;
  const styleClass = styles[`style_${widgetStyle}`] || '';

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [formData, setFormData] = useState({ name: '', url: '' });
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const inputRef = useRef(null);

  // Open add modal
  const handleOpenAdd = () => {
    setFormData({ name: '', url: '' });
    setEditingBookmark(null);
    setShowAddModal(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Open edit modal
  const handleOpenEdit = (bookmark, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData({ name: bookmark.name, url: bookmark.url });
    setEditingBookmark(bookmark);
    setShowAddModal(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    let url = formData.url.trim();
    const name = formData.name.trim();

    if (!url) return;

    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      alert(language === 'ko' ? '유효한 URL을 입력해주세요.' : 'Please enter a valid URL.');
      return;
    }

    if (editingBookmark) {
      updateBookmark(editingBookmark.id, { name: name || url, url });
    } else {
      addBookmark({ name: name || url, url });
    }

    setShowAddModal(false);
    setFormData({ name: '', url: '' });
    setEditingBookmark(null);
  };

  // Handle delete
  const handleDelete = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(language === 'ko' ? '이 북마크를 삭제하시겠습니까?' : 'Delete this bookmark?')) {
      removeBookmark(id);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (index !== dragOverIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newBookmarks = [...bookmarks];
    const [draggedItem] = newBookmarks.splice(draggedIndex, 1);
    newBookmarks.splice(dropIndex, 0, draggedItem);
    reorderBookmarks(newBookmarks);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle bookmark click
  const handleBookmarkClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const bookmarkList = bookmarks || [];

  return (
    <div className={styles.container}>
      {/* Bookmarks Grid */}
      <div className={`${styles.grid} ${sizeClass}`}>
        {bookmarkList.map((bookmark, index) => (
          <div
            key={bookmark.id}
            className={`${styles.bookmark} ${sizeClass} ${styleClass} ${dragOverIndex === index ? styles.dragOver : ''} ${draggedIndex === index ? styles.dragging : ''}`}
            draggable={!isEditing}
            onDragStart={!isEditing ? (e) => handleDragStart(e, index) : undefined}
            onDragOver={!isEditing ? (e) => handleDragOver(e, index) : undefined}
            onDragLeave={!isEditing ? handleDragLeave : undefined}
            onDrop={!isEditing ? (e) => handleDrop(e, index) : undefined}
            onDragEnd={!isEditing ? handleDragEnd : undefined}
            onClick={() => handleBookmarkClick(bookmark.url)}
            title={bookmark.url}
          >
            {/* Favicon */}
            <div className={styles.favicon}>
              {getFaviconUrl(bookmark.url) ? (
                <img
                  src={getFaviconUrl(bookmark.url)}
                  alt=""
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={styles.fallbackIcon} style={{ display: getFaviconUrl(bookmark.url) ? 'none' : 'flex' }}>
                <IoGlobe />
              </div>
            </div>

            {/* Name */}
            <span className={styles.name}>{bookmark.name}</span>

            {/* Edit/Delete buttons - only in edit mode */}
            {isEditing && (
              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={(e) => handleOpenEdit(bookmark, e)}
                  title={language === 'ko' ? '편집' : 'Edit'}
                >
                  <IoCreate />
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => handleDelete(bookmark.id, e)}
                  title={language === 'ko' ? '삭제' : 'Delete'}
                >
                  <IoClose />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Button - only in edit mode */}
        {isEditing && (
          <button
            className={`${styles.addBtn} ${sizeClass}`}
            onClick={handleOpenAdd}
            title={language === 'ko' ? '북마크 추가' : 'Add Bookmark'}
          >
            <IoAdd />
            <span>{language === 'ko' ? '추가' : 'Add'}</span>
          </button>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>
              {editingBookmark
                ? (language === 'ko' ? '북마크 편집' : 'Edit Bookmark')
                : (language === 'ko' ? '북마크 추가' : 'Add Bookmark')
              }
            </h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>
                  <IoLink />
                  URL
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>
                  {language === 'ko' ? '이름 (선택)' : 'Name (optional)'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'ko' ? '표시할 이름' : 'Display name'}
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  {language === 'ko' ? '취소' : 'Cancel'}
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingBookmark
                    ? (language === 'ko' ? '저장' : 'Save')
                    : (language === 'ko' ? '추가' : 'Add')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
