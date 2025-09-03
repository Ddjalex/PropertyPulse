import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import type { TeamMember } from '@shared/schema';

interface TeamMemberProps {
  member: TeamMember;
  onCall?: (member: TeamMember) => void;
  onWhatsApp?: (member: TeamMember) => void;
  onEmail?: (member: TeamMember) => void;
}

export default function TeamMemberCard({ 
  member, 
  onCall, 
  onWhatsApp, 
  onEmail 
}: TeamMemberProps) {
  const defaultImage = member.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400';

  return (
    <Card className="overflow-hidden text-center hover:shadow-lg transition-shadow duration-300" data-testid={`team-member-${member.id}`}>
      <img 
        src={defaultImage} 
        alt={member.name}
        className="w-full h-64 object-cover"
        data-testid="member-image"
      />
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-card-foreground mb-1" data-testid="member-name">
          {member.name}
        </h3>
        <p className="text-primary font-medium mb-3" data-testid="member-position">
          {member.position}
        </p>
        {member.bio && (
          <p className="text-muted-foreground text-sm mb-4" data-testid="member-bio">
            {member.bio}
          </p>
        )}
        
        {member.specializations && member.specializations.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Specializations:</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {member.specializations.map((spec, index) => (
                <span 
                  key={index}
                  className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                  data-testid={`member-specialization-${index}`}
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-center space-x-3">
          {member.phone && (
            <Button
              onClick={() => onCall?.(member)}
              size="sm"
              className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
              data-testid="button-member-call"
            >
              <Phone size={16} />
            </Button>
          )}
          {member.whatsapp && (
            <Button
              onClick={() => onWhatsApp?.(member)}
              size="sm"
              className="bg-secondary text-secondary-foreground p-2 rounded-full hover:bg-secondary/90 transition-colors"
              data-testid="button-member-whatsapp"
            >
              <MessageCircle size={16} />
            </Button>
          )}
          {member.email && (
            <Button
              onClick={() => onEmail?.(member)}
              size="sm"
              variant="outline"
              className="p-2 rounded-full hover:bg-foreground hover:text-background transition-colors"
              data-testid="button-member-email"
            >
              <Mail size={16} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
