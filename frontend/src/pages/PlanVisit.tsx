import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../api';

type VisitRequestForm = {
  visitDate: string;
  destination: string;
  lengthOfStay: string;
  purpose: string;
  guestCount: string;
  hostPreference: string;
  message: string;
};

type StoredVisitRequest = VisitRequestForm & {
  id: string;
  submittedAt?: string;
  status?: string;
};

const PlanVisit: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get('date') || '';
  const visitId = searchParams.get('visitId') || '';
  const isEditing = Boolean(visitId);
  const [saveMessage, setSaveMessage] = useState('');
  const [form, setForm] = useState<VisitRequestForm>({
    visitDate: selectedDate,
    destination: '',
    lengthOfStay: '',
    purpose: '',
    guestCount: '1',
    hostPreference: '',
    message: '',
  });

  React.useEffect(() => {
    const loadVisit = async () => {
      if (!visitId) {
        return;
      }

      try {
        const data = await apiRequest<{ visitRequest: StoredVisitRequest }>(
          `/api/visit-requests/${visitId}`,
          { auth: true },
        );
        setForm({
          visitDate: data.visitRequest.visitDate,
          destination: data.visitRequest.destination,
          lengthOfStay: data.visitRequest.lengthOfStay,
          purpose: data.visitRequest.purpose,
          guestCount: data.visitRequest.guestCount,
          hostPreference: data.visitRequest.hostPreference,
          message: data.visitRequest.message,
        });
      } catch (error) {
        setSaveMessage(
          error instanceof Error ? error.message : 'Unable to load visit.',
        );
      }
    };

    loadVisit();
  }, [visitId]);

  const readableDate = useMemo(() => {
    if (!form.visitDate) {
      return 'No date selected';
    }

    return new Intl.DateTimeFormat('en', {
      dateStyle: 'long',
    }).format(new Date(`${form.visitDate}T00:00:00`));
  }, [form.visitDate]);

  const updateField = (field: keyof VisitRequestForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setSaveMessage('');
  };

  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await apiRequest(
        isEditing ? `/api/visit-requests/${visitId}` : '/api/visit-requests',
        {
          method: isEditing ? 'PUT' : 'POST',
          auth: true,
          body: JSON.stringify(form),
        },
      );
      setSaveMessage(
        isEditing
          ? 'Visit request updated.'
          : 'Visit request draft saved for hosts.',
      );
      navigate(isEditing ? '/visits' : '/dashboard');
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : 'Unable to save visit.',
      );
    }
  };

  return (
    <main className="page plan-visit-page">
      <div className="profile-header">
        <h1>{isEditing ? 'Edit Visit' : 'Plan Visit'}</h1>
        <p>
          Add the details hosts need before they decide whether they can welcome
          you.
        </p>
      </div>

      <form className="profile-form" onSubmit={submitRequest}>
        <section className="profile-section">
          <div className="profile-section-heading">
            <h2>Visit Details</h2>
            <span className="profile-chip">{readableDate}</span>
          </div>

          <div className="profile-grid">
            <label>
              Visit Date
              <input
                type="date"
                value={form.visitDate}
                onChange={(event) => updateField('visitDate', event.target.value)}
                required
              />
            </label>
            <label>
              Destination
              <input
                type="text"
                value={form.destination}
                onChange={(event) =>
                  updateField('destination', event.target.value)
                }
                placeholder="Islamabad, F-7"
                required
              />
            </label>
            <label>
              Number of Days
              <input
                type="number"
                min="1"
                value={form.lengthOfStay}
                onChange={(event) =>
                  updateField('lengthOfStay', event.target.value)
                }
                placeholder="3"
                required
              />
            </label>
            <label>
              Guests
              <input
                type="number"
                min="1"
                value={form.guestCount}
                onChange={(event) =>
                  updateField('guestCount', event.target.value)
                }
                required
              />
            </label>
            <label>
              Purpose of Visit
              <input
                type="text"
                value={form.purpose}
                onChange={(event) => updateField('purpose', event.target.value)}
                placeholder="Conference, meetings, tourism"
                required
              />
            </label>
            <label>
              Host Preference
              <input
                type="text"
                value={form.hostPreference}
                onChange={(event) =>
                  updateField('hostPreference', event.target.value)
                }
                placeholder="Quiet home, workspace, family residence"
              />
            </label>
            <label className="profile-wide-field">
              Message to Hosts
              <textarea
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                placeholder="Introduce yourself and explain what kind of stay would help you."
                required
              />
            </label>
          </div>
        </section>

        <div className="profile-actions">
          <Link to="/dashboard" className="btn btn-outline">
            Back to Calendar
          </Link>
          {saveMessage && <span className="profile-save-message">{saveMessage}</span>}
          <button type="submit" className="btn primary">
            {isEditing ? 'Save Visit' : 'Send Request to Hosts'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default PlanVisit;
