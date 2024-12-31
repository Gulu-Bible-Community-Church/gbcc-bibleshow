import '../assets/css/main.css'
import '../assets/css/modal.css'

const Modal = ({ isOpen, title, message, type, onClose }) => {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
			<div className="modal-content" onClick={e => e.stopPropagation()}>
				<div className={`modal-header ${type}`}>
					{type === 'error' ? (
						<svg className="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12" y2="16" />
						</svg>
					) : (
						<svg className="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
					)}
					<h2 className="modal-title">{title}</h2>
				</div>
				<div className="modal-body">
					<p>{message}</p>
				</div>
				<button className="modal-close-btn" onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};
export default Modal;